from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from engine.app.models import Query, QueryResponse
from engine.app.dependencies import Dependencies
from engine.app.services import QueryService
import logging
from dotenv import load_dotenv
from engine.app.config import settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize dependencies
deps = Dependencies()
query_service = QueryService(deps)

@app.post("/query", response_model=QueryResponse)
async def query_documents(query: Query) -> QueryResponse:
    try:
        # Get relevant documents
        docs_content = query_service.get_relevant_documents(
            question=query.question,
            project_details=query.project_details
        )
        
        # Get references and their context
        references, ref_context = query_service.get_references_data(docs_content)
        all_context = docs_content + ref_context
        
        # Get formatted answer
        formatted_answer = query_service.get_formatted_answer(
            context=all_context,
            question=query.question,
            project_details=query.project_details
        )
        
        # Return the formatted answer directly as it now matches QueryResponse structure
        return QueryResponse(content=formatted_answer.content, thought=formatted_answer.thought, action=formatted_answer.action, observation=formatted_answer.observation, output=formatted_answer.output)
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)