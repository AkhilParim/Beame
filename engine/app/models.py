"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel
from typing import List, Optional

# These are the pydantic models for the query and reference
class Query(BaseModel):
    question: str

class Reference(BaseModel):
    content: str
    references: List[str]

class QueryResponse(BaseModel):
    formatted_answer: str
    relevant_documents: Optional[List[str]] = None
    references: Optional[List[str]] = None
    additional_context: Optional[List[str]] = None 