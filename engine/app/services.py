#type: ignore
"""
Core business logic for processing queries and generating responses.
"""

from typing import List, Tuple
from engine.app.models import ProjectDetails, ReferencesResponse, QueryResponse
from langchain.prompts import ChatPromptTemplate
from qdrant_client import models
import logging
from .templates import REFERENCES_TEMPLATE, FORMATTED_ANSWER_TEMPLATE
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class QueryService:
    def __init__(self, deps):
        self.deps = deps

    def get_relevant_documents(self, question: str, project_details: ProjectDetails) -> List[str]:
        """
        Retrieve relevant documents for a given question and project details.
        """
        try:
            # Format project details into a string
            project_details_dict = project_details.model_dump()
            project_details_str = ", ".join([f"{k}: {v}" for k, v in project_details_dict.items()])
            
            # Combine question with project details
            full_query = f"{question} for the requirements {project_details_str}"
            
            docs = self.deps.retriever.get_relevant_documents(full_query)
            return [doc.page_content for doc in docs]
        except Exception as e:
            logger.error(f"Error retrieving documents: {str(e)}")
            raise

    def get_references_data(self, docs: List[str]) -> Tuple[List[str], List[str]]:
        try:
            prompt = ChatPromptTemplate.from_template(REFERENCES_TEMPLATE)
            chain = prompt | self.deps.llm.with_structured_output(ReferencesResponse)
            
            response = chain.invoke({"text": docs})
            references = set(response.list)
            
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
            raise HTTPException(status_code=500, detail="Internal server error")
        # except ValidationError as e:
        #     logger.error(f"LLM response validation failed in get_references_data: {str(e)}")
        #     raise HTTPException(status_code=422, detail="Failed to process response")
        # except APIConnectionError as e:
        #     logger.error(f"API connection failed in get_references_data: {str(e)}")
        #     raise HTTPException(status_code=503, detail="Service temporarily unavailable")

    def get_formatted_answer(self, context: List[str], question: str, project_details: ProjectDetails) -> str:
        try:
            prompt = ChatPromptTemplate.from_template(FORMATTED_ANSWER_TEMPLATE)
            chain = prompt | self.deps.llm.with_structured_output(QueryResponse)
            
            # Convert project details to a formatted string
            project_details_dict = project_details.model_dump()
            project_details_str = "\n".join([f"{k}: {v}" for k, v in project_details_dict.items()])
            
            response = chain.invoke({
                "topic": question,
                "context": "\n".join(context),
                "project_details": project_details_str
            })

            # Log the raw LLM response
            logger.info("\n=== Raw LLM Response ===")
            logger.info(response.model_dump_json())
            logger.info("=======================")
            
            return response
        except Exception as e:
            logger.error(f"Error in get_formatted_answer: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
        # except ValidationError as e:
        #     logger.error(f"LLM response validation failed in get_formatted_answer: {str(e)}")
        #     raise HTTPException(status_code=422, detail="Failed to process response")
        # except APIConnectionError as e:
        #     logger.error(f"API connection failed in get_formatted_answer: {str(e)}")
        #     raise HTTPException(status_code=503, detail="Service temporarily unavailable")