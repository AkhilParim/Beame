"""
Core business logic for processing queries and generating responses.
"""

from typing import List, Tuple
import json
from langchain.prompts import ChatPromptTemplate
from qdrant_client import models
import logging
from .templates import REFERENCES_TEMPLATE, FORMATTED_ANSWER_TEMPLATE

logger = logging.getLogger(__name__)

class QueryService:
    def __init__(self, deps):
        self.deps = deps

    def get_references_data(self, docs: List[str]) -> Tuple[List[str], List[str]]:
        try:
            prompt = ChatPromptTemplate.from_template(REFERENCES_TEMPLATE)
            chain = prompt | self.deps.llm
            
            response = chain.invoke({"text": docs})
            references = set(json.loads(response.content)['list'])
            
            context = []            
            for refer in references:
                result = self.deps.qdrant_hybrid.similarity_search(
                    query="",
                    k=1,
                    filter=models.Filter(
                        should=[
                            models.FieldCondition(
                                key=f"metadata.Header_{i}",
                                match=models.MatchText(text=refer),
                            ) for i in range(1, 4)
                        ]
                    )
                )
                if len(result):
                    context.append(result[0].page_content)
            
            return list(references), context
        except Exception as e:
            logger.error(f"Error in get_references_data: {str(e)}")
            raise

    def get_formatted_answer(self, context: List[str], question: str) -> str:
        try:
            prompt = ChatPromptTemplate.from_template(FORMATTED_ANSWER_TEMPLATE)
            chain = prompt | self.deps.llm
            
            response = chain.invoke({
                "topic": question,
                "context": context
            })
            
            return response.content
        except Exception as e:
            logger.error(f"Error in get_formatted_answer: {str(e)}")
            raise 