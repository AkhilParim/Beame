export interface DevelopmentClass {
  name: string;
  types: string[];
}

export const developmentClasses: DevelopmentClass[] = [
    {
      name: 'Class 1 - Office',
      types: [
        'Office',
        'Financial Facility'
      ]
    },
    {
      name: 'Class 2 - Residential',
      types: [
        'Apartment/Multi-family residential',
        'Single-family',
        'Second-dwelling unit',
        'Single-family lots with Courtyard style development',
        'Special Residential',
        'Retirement community',
        'Hotel or motel',
        'Multi-unit (MUR)'
      ]
    },
    {
      name: 'Class 3 - Health Care Facilities',
      types: [
        'Hospital',
        'Psychiatric hospital',
        'Clinic (medical complex)',
        'Clinic (medical or dental)',
        'Nursing home',
        'Funeral home or mortuary',
        'Veterinary clinic'
      ]
    },
    {
      name: 'Class 4 - Industrial and Commercial Manufacturing',
      types: [
        'Multi-tenant (or multi-building project): At grade (no docks)',
        'Multi-tenant (or multi-building project): Semi-dock high',
        'Multi-tenant (or multi-building project): Full-dock high',
        'Bulk warehouse',
        'Heavy manufacturing and industrial',
        'Light manufacturing assembly and research and development',
        'Truck terminal',
        'Mini-warehouse facility'
      ]
    },
    {
      name: 'Class 5 - Religious and Educational',
      types: [
        'Church',
        'Nursery school or day care center',
        'School (public, denominational or private)',
        'Elementary school',
        'Junior high school (including a school for 9th grade only)',
        'Senior high school',
        'College/university/trade school',
        'Library',
        'Art gallery or museum'
      ]
    },
    {
      name: 'Class 6 - Recreation and Entertainment',
      types: [
        'Golf course',
        'Movie theater',
        'Bowling alley',
        'Theater/auditorium/arena',
        'Tennis/racquet club',
        'Sports club /health spa',
        'Roller/ice skating rink',
        'Swimming club',
        'Park (5 to 10 acres)',
        'Park (over 10 acres)',
        'Park pavilion',
        'Sports complex',
        'Miniature golf',
        'Driving range (golf)',
        'Arcade or game room'
      ]
    },
    {
      name: 'Class 7 - Food and Beverage',
      types: [
        'Take-out restaurant',
        'Dessert shop',
        'Small restaurant',
        'Neighborhood restaurant',
        'Restaurant',
        'Tavern or pub',
        'Small bar',
        'Bar/club/lounge'
      ]
    },
    {
      name: 'Class 8 - Retail Services',
      types: [
        'Supermarket',
        'Furniture store',
        'Retail store',
        'Building materials or home improvement store',
        'Barber or beauty shop',
        'Shopping center (strip) (up to 25,000 square feet of GFA)',
        'Shopping center (neighborhood)(25,000—100,000 square feet of GFA)',
        'Shopping center (regional) (over 100,000 square feet of GFA)'
      ]
    },
    {
      name: 'Class 9 - Automobiles',
      types: [
        'Auto sales dealer',
        'Auto repair establishment',
        'Car wash (automated)',
        'Car wash (all other)',
        'Service station',
        'Auto parts and supply store'
      ]
    }
];

export const developmentStatuses = [
  'Vacant Lot',
  'Redevelopment'
];

export const streetTypes = [
  'Major thoroughfare',
  'Major collector',
  'Minor collector',
  'Local street'
];

export const floodplainZones = [
  'None',
  '1% annual chance flood with BFE (100 year)',
  '0.2% annual chance flood (500 year)',
  'Regulatory Floodway'
]; 