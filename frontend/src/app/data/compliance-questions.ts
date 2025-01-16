export interface ComplianceQuestion {
  title: string;
  question: string;
}

export const complianceQuestions: ComplianceQuestion[] = [
  {
    title: 'Landscape Buffer yard requirements',
    question:
`Landscape plan required or not.
Parking landscape requirements.
Planting credit requirements.
Planting location.
Planting arrangement.
Species list.
Special landscape restrictions.
Landscape area required.
Protected Trees.
Green corridors.
Protected Tree counting towards plating credit or not.
Tree mitigation required or not.
Screening methods.
Existing Tree conditions.
Open Space requirements.
Grading/Slopes restrictions.
Plan regulations (notes to include in plans submitted for permit or review).`
  },
  {
    title: 'Buffer Yard requirements',
    question: 
`Buffer yard required or not
Buffer yard dimensions
Building height requirements
Type of building requirements
Planting requirements within the buffer yard
Screening requirements within the buffer yard
Building restrictions within the setback
grading/elevations restrictions`
  },
  {
    title: 'Setbacks',
    question: 
`Setbacks required or not
Steback yard dimensions
Type of setback
Building height requirements
Type of building requirements
Planting requirements within the setback
Screening requirements within the setback
Building restrictions within the setback
grading/elevations restrictions`
  },
  {
    title: 'Building Lines',
    question:
`Building Lines required or not
Building line dimensions
Type of building line
Building height requirements
Location restrictions`
  }
]; 