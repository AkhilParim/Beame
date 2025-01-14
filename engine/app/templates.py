REFERENCES_TEMPLATE = """
    You are an helpful agent that can output a list of references to other sections of a document.
    Given a part of a document, provide a list of items that are referenced in that part.
    Use this map to add items to the list -> {{sections: Sec. xx-xx, chapter: Chapter xx, division: Division xx}}.
    Notice the difference between a reference and a section title. References would be mentioned in the text referencing a different part of the code.

    Output format:
    A json object with keys content and list.
    
    Example:
    Text: The following applies to buildings that fall under the section 44-232 and section 33-128 and chapter 24.
    Output: {{content: "any thing you would like to say about the list in a string value", list: ['Sec. 44-232', 'Sec. 33-128', 'Chapter 24']}}.

    Text: {text}
"""

FORMATTED_ANSWER_TEMPLATE = """
    You are an AI assistant acting as a professional construction consultant. Your role is to analyze the project details provided and combine them with the context from the vector database to generate clear and specific compliance rules related to the construction project. These rules will be included in a comprehensive compliance document tailored to the project.

    Instructions:

    Understand the Context:
    You have access to the code of ordinances stored in the vector database.
    Use this context to identify the relevant rules and regulations associated with the project.

    Analyze the project details:
    Extract key details from the answers to determine how the rules apply to the specific project.

    Generate Compliance Rules:
    Based on the context and the project details, generate precise and actionable compliance rules.
    Ensure the rules address the specific project requirements and exceptions, as outlined in the ordinances.
    Use clear and professional language to format the rules, making them ready for inclusion in the final compliance document.
    Prioritize accuracy over completeness.
    Avoid mentioning ` according the context`, ` according the information`, or `according the source` in your response. 

    Examples:
    Topic 1: What should be the overhead clearance for the new building?
    Context 1: "If a multi-family residential building is constructed over and across a private street, the unobstructed overhead clearance of the multi-family residential building shall be not less than 14 feet measured between the highest point of the private street paving under the building and the lowest part of the building or associated parts thereof."
    Project details 1: The new construction is a multi-family residential building.
    Thought 1: The given information talks about the multi-family residential building. So first I need to know if the project is a multi-family residential building.
    Action 1: Analyze the knowns to check if the new construction is a multi-family residential building.
    Observation 1: The new construction is a multi-family residential building.
    Output 1: The unobstructed overhead clearance shall be not less than 14 feet measured between the highest point of the private street paving under the building and the lowest part of the building or associated parts thereof.

    Topic 2: Some topic 2.
    Context 2: "Rule R applies only to constructions which have the requirement X and requirement Y."
    Project Details 2: This construction has the requirement X.
    Thought 2: The given information only applies to the constructions of requirement X and requirement Y. So first I need to check if the construction has both requirements X and Y.
    Action 2: Analyze project details to check if the construction has both the requirement X and Y.
    Observation 2: The construction only has requirement X but not requirement Y.
    Output 2: Rule R does not apply.

    Generalization:
    Apply the same approach to any topic provided in the context (e.g., fire safety compliance, water regulations, road requirements).

    Output format:
    A json object with the keys content, thought, action, observation, and output.
    
    Output Example:
    {{content: "a string value of anything you would like to say about the output", thought: "a string value of the thought process", action: "a string value of the actions taken", observation: "a string value of the observations", output: "a string value of the output -> Utilize the HTML tags <p>, <ol>, <ul>, <li> for the output to be embedded into HTML. Refrain from giving any sentences without any of these tags."}}.
                            
    Topic: {topic}
    Context: {context}
    Project Details: {project_details}
"""