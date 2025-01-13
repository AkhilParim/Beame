import requests
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        
    def query_documents(self, question: str) -> Dict[str, Any]:
        try:
            endpoint = f"{self.base_url}/query"
            payload = {"question": question}
            
            logger.info(f"Sending query: {question}")
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info("Query successful")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error querying API: {str(e)}")
            raise

def main():
    # Initialize API client
    client = APIClient()
    
    # Test questions
    questions = [
        "What are the buffer yards landscape requirements for high-rise buildings?",
        # "What are the requirements for residential buffering?",
        # "What are the landscape plan requirements?"
    ]
    
    # Test each question
    for question in questions:
        try:
            print("\n" + "="*80)
            print(f"Testing question: {question}")
            print("="*80)
            
            result = client.query_documents(question)
            
            print("\nFormatted Answer:")
            print(result["formatted_answer"])
            
            if result.get("relevant_documents"):
                print("\nRelevant Documents:")
                for i, doc in enumerate(result["relevant_documents"], 1):
                    print(f"\n{i}. {doc[:200]}...")
                
            if result.get("references"):
                print("\nReferences Found:")
                for i, ref in enumerate(result["references"], 1):
                    print(f"{i}. {ref}")
                
            if result.get("additional_context"):
                print("\nAdditional Context:")
                for i, context in enumerate(result["additional_context"], 1):
                    print(f"\n{i}. {context[:200]}...")
                
        except Exception as e:
            print(f"Error processing question: {str(e)}")
            continue

if __name__ == "__main__":
    main() 