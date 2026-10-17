export const schemes = [
  {
    name: 'e-Shram',
    category: 'Worker registration',
    description: 'National database registration for unorganised workers. Check the official portal for current services and registration details.',
    eligibility: 'Eligibility and available benefits depend on current government rules. Confirm directly on the official portal.',
    url: 'https://eshram.gov.in/',
    icon: 'workers',
  },
  {
    name: 'Pradhan Mantri Shram Yogi Maandhan',
    category: 'Pension',
    description: 'A voluntary contributory pension scheme for eligible unorganised workers. Contribution and eligibility conditions apply.',
    eligibility: 'Please confirm current age, income and other eligibility conditions with the official scheme portal.',
    url: 'https://maandhan.in/',
    icon: 'shield',
  },
  {
    name: 'myScheme',
    category: 'Find schemes',
    description: 'Government scheme-discovery portal that helps people explore schemes using their profile and needs.',
    eligibility: 'Use the official portal to review each scheme’s current eligibility and application process.',
    url: 'https://www.myscheme.gov.in/',
    icon: 'schemes',
  },
  {
    name: 'PM SVANidhi',
    category: 'Street vendors',
    description: 'Official portal for the street-vendor support scheme. Availability depends on applicable government rules and locations.',
    eligibility: 'The portal lists notified States and UTs. Check the current location and eligibility requirements before applying.',
    url: 'https://pmsvanidhi.mohua.gov.in/',
    icon: 'vendors',
  },
  {
    name: 'Skill India Digital Hub',
    category: 'Skills & learning',
    description: 'Government digital hub for exploring skill development, learning, and career-growth resources.',
    eligibility: 'Check the official hub for current courses, access requirements, and availability.',
    url: 'https://www.skillindiadigital.gov.in/home',
    icon: 'skills',
  },
  {
    name: 'Apprenticeship Training Portal',
    category: 'Skills & learning',
    description: 'Government portal for apprenticeship training information and opportunities.',
    eligibility: 'Opportunities and requirements vary. Confirm current details directly on the official portal.',
    url: 'https://www.apprenticeshipindia.gov.in/',
    icon: 'apprenticeship',
  },
]

export const rightsResources = [
  { title: 'Emergency response', detail: 'From a phone, dial 112 for emergency assistance. Desktop browsers may not be able to place calls.', label: 'Call 112 from a phone', url: 'tel:112' },
  { title: 'e-Shram worker resources', detail: 'Check official information for unorganised workers and registration.', label: 'e-Shram portal', url: 'https://eshram.gov.in/' },
  { title: 'Know your local support', detail: 'For labour concerns, contact your state labour department or a qualified local legal-aid provider.', label: 'National Legal Services Authority', url: 'https://nalsa.gov.in/' },
]

export const suggestions = [
  { icon: 'Wallet', title: 'Track my pay', prompt: 'How can I keep track of my weekly earnings and expenses?' },
  { icon: 'ShieldCheck', title: 'My work rights', prompt: 'What records should I keep if a platform deducts money from my pay?' },
  { icon: 'FileText', title: 'Explain a document', prompt: 'What details should I look for in a work agreement?' },
]
