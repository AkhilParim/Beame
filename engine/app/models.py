"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel
from typing import List, Optional

# These are the pydantic models for the query and reference
class Query(BaseModel):
    question: str
    project_details: str

class ReferencesResponse(BaseModel):
    content: str
    list: List[str]


class Reference(BaseModel):
    content: str
    references: List[str]

class QueryResponse(BaseModel):
    content: str
    thought: str
    action: str
    observation: str
    output: str 