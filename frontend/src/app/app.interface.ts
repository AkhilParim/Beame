export interface Project {
    id?: number;
    project: {
      projectName: string;
      projectDescription: string;
      developmentType: string;
      classType: string;
      developmentStatus: string;
      propertySize: number;
      buildingHeight: number;
      numberOfStreets: number;
      adjacentStreet1: string;
      adjacentStreet2?: string;
      adjacentStreet3?: string;
      adjacentStreet4?: string;
      floodplainZone: string;
      testQuery?: string;
    };
    designConstraints?: any;
    createdAt?: string;
  } 

  export interface QueryRequest {
    question: string;
    project_details: any;
  }
  
  export interface QueryResponse {
    content: string;
    thought: string;
    action: string;
    observation: string;
    output: string;
  } 

  export interface ReportSection {
    title: string;
    response: QueryResponse | null;
    isLoading: boolean;
    error: string | null;
  }