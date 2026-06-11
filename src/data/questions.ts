export type QuestionType = 'single' | 'multi' | 'scale' | 'text'

export interface Question {
  id: string
  type: QuestionType
  question: string
  subtext?: string
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
  required?: boolean
}

export const questions: Question[] = [
  {
    id: 'role',
    type: 'single',
    question: 'Are you a student or a landlord?',
    subtext: 'This helps us tailor the right experience for you.',
    options: ['Student at BUK', 'Landlord / Property Owner', 'Both', 'Other'],
    required: true,
  },
  {
    id: 'marketplace_need',
    type: 'single',
    question: 'Would you use a dedicated Marketplace on BUK Housing?',
    subtext: 'The Marketplace lets students buy, sell, and swap items like furniture, textbooks, and electronics — all within the BUK community.',
    options: [
      'Definitely — I would use it regularly',
      'Probably — sounds useful',
      'Maybe — depends on what\'s listed',
      'Unlikely — I don\'t need this',
      'No — I wouldn\'t use it at all',
    ],
    required: true,
  },
  {
    id: 'marketplace_items',
    type: 'multi',
    question: 'What would you most likely buy or sell on the Marketplace?',
    subtext: 'Select all that apply.',
    options: [
      'Furniture (bed frames, chairs, desks)',
      'Textbooks & course materials',
      'Electronics (fans, lamps, chargers)',
      'Clothing & accessories',
      'Kitchen items & appliances',
      'Stationery & office supplies',
      'Other household items',
    ],
  },
  {
    id: 'priority',
    type: 'scale',
    question: 'How high a priority is the Marketplace compared to the core housing search?',
    subtext: '1 = not important at all, 5 = just as important as finding housing',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: 'Not a priority', max: 'Top priority' },
  },
  {
    id: 'trust_concerns',
    type: 'multi',
    question: 'What would make you trust the Marketplace?',
    subtext: 'Select everything that matters to you.',
    options: [
      'Verified student/BUK ID on seller profiles',
      'Ratings & reviews for buyers and sellers',
      'In-app messaging between buyer and seller',
      'Ability to report suspicious listings',
      'Transaction history visible on profiles',
      'Admin moderation of listings',
    ],
  },
  {
    id: 'payment_preference',
    type: 'single',
    question: 'How would you prefer to handle payments on the Marketplace?',
    options: [
      'Cash on pickup — keep it simple',
      'In-app payment (card / bank transfer)',
      'Escrow — release funds on delivery',
      'No preference',
    ],
  },
  {
    id: 'extra_features',
    type: 'multi',
    question: 'Which other features would make BUK Housing more useful for you?',
    subtext: 'Select all that interest you.',
    options: [
      'Roommate matching',
      'Virtual tours of properties',
      'Landlord ratings & reviews',
      'Rent payment tracking',
      'Maintenance request system',
      'Neighborhood safety ratings',
      'Price comparison between similar listings',
    ],
  },
  {
    id: 'feedback',
    type: 'text',
    question: 'Anything else you want us to know?',
    subtext: 'Feature requests, concerns, or anything on your mind — we read every response.',
  },
]
