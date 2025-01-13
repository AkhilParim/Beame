"""
Manages external service connections (OpenAI, Qdrant, Claude).
Provides centralized dependency injection and error handling.
"""

from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore, FastEmbedSparse
from langchain_anthropic import ChatAnthropic
import logging
from .config import settings

logger = logging.getLogger(__name__)

class Dependencies:
    def __init__(self):
        self.vector_embeddings = None
        self.sparse_embeddings = None
        self.retriever = None
        self.llm = None
        self.initialize_services()

    def initialize_services(self):
        try:
            # Initialize connections and models
            self.vector_embeddings = OpenAIEmbeddings(
                api_key=settings.OPENAI_API_KEY,
                model=settings.EMBEDDING_MODEL
            )
            self.sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")
            
            # Initialize QdrantVectorStore
            self.qdrant_hybrid = QdrantVectorStore.from_existing_collection(
                embedding=self.vector_embeddings,
                sparse_embedding=self.sparse_embeddings,
                collection_name=settings.QDRANT_COLLECTION,
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY
            )

            self.retriever = self.qdrant_hybrid.as_retriever(search_kwargs={"k": 10})
            
            # Initialize Anthropic LLM
            self.llm = ChatAnthropic(
                model=settings.LLM_MODEL,
                temperature=0.5,
                timeout=None,
                max_retries=2,
                api_key=settings.ANTHROPIC_API_KEY
            )
        except Exception as e:
            logger.error(f"Error initializing services: {str(e)}")
            raise 