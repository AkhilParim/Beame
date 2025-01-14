"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel
from typing import List, Optional

# These are the pydantic models for the query and reference
class ProjectDetails(BaseModel):
    projectName: Optional[str] = None
    projectDescription: Optional[str] = None
    developmentType: str
    classType: str
    developmentStatus: str
    propertySize: str
    buildingHeight: str
    numberOfStreets: str
    adjacentStreets: List[str]
    floodplainZone: str

class Query(BaseModel):
    question: str
    project_details: ProjectDetails

class ReferencesResponse(BaseModel):
    content: str
    list: List[str]

class FormattedAnswer(BaseModel):
    content: str
    thought: str
    action: str
    observation: str
    output: str

class Reference(BaseModel):
    content: str
    references: List[str]

class QueryResponse(BaseModel):
    formatted_answer: str
    relevant_documents: Optional[List[str]] = None
    references: Optional[List[str]] = None
    additional_context: Optional[List[str]] = None 