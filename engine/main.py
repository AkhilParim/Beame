#type: ignore
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Query, QueryResponse
from app.dependencies import Dependencies
from app.services import QueryService
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize dependencies and services
deps = Dependencies()
query_service = QueryService(deps)

@app.post("/query", response_model=QueryResponse)
async def query_documents(query: Query):
    """
    Query documents and get relevant references with formatted answer
    """
    try:
        logger.info(f"Processing query: {query.question}")
        
        # Get relevant documents
        docs = deps.retriever.get_relevant_documents(query.question)
        docs_content = [d.page_content for d in docs]
        
        # Get references and additional context
        references, additional_context = query_service.get_references_data(docs_content)
        
        # Combine all context for the formatted answer
        all_context = docs_content + additional_context
        
        # Get formatted answer
        formatted_answer = query_service.get_formatted_answer(all_context, query.question)
        
        return QueryResponse(formatted_answer=formatted_answer)
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