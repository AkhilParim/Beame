"""
Configuration management like environment variables and other settings.
"""

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    QDRANT_URL: str = os.getenv("QDRANT_URL")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY")
    
    QDRANT_COLLECTION: str = "city-of-houston"
    EMBEDDING_MODEL: str = "text-embedding-3-large"
    LLM_MODEL: str = "claude-3-5-sonnet-latest"
    
    class Config:
        case_sensitive = True

settings = Settings() 