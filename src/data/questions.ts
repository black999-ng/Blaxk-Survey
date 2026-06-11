export type QuestionType = 'single' | 'multi' | 'scale' | 'text'
export type Language = 'en' | 'ha'

export interface QuestionText {
  en: string
  ha: string
}

export interface Question {
  id: string
  type: QuestionType
  question: QuestionText
  subtext?: QuestionText
  options?: QuestionText[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: QuestionText; max: QuestionText }
  required?: boolean
  roles?: ('buyer' | 'seller')[]
}

// Personal Information & Setup Questions
export const setupQuestions: Question[] = [
  {
    id: 'full_name',
    type: 'text',
    question: { en: 'What is your full name?', ha: 'Menene sunanka?' },
    subtext: { en: 'Tell us your name', ha: 'Gaya muni sunanka' },
    required: true,
  },
  {
    id: 'reg_number',
    type: 'text',
    question: { en: 'What is your registration number?', ha: 'Menene lambar komarya?' },
    subtext: { en: 'Your student ID or registration number', ha: 'Lambar ɗalibi ko lambar komarya' },
    required: true,
  },
  {
    id: 'level',
    type: 'single',
    question: { en: 'What is your current level?', ha: 'Menene ɗakin karatun ka a yanzu?' },
    subtext: { en: 'Choose your year of study', ha: 'Zaɓi ɗakin karatun ka' },
    options: [
      { en: '100 Level', ha: 'Ɗakin 100' },
      { en: '200 Level', ha: 'Ɗakin 200' },
      { en: '300 Level', ha: 'Ɗakin 300' },
      { en: '400 Level', ha: 'Ɗakin 400' },
      { en: 'Postgraduate', ha: 'Karatu Jiya-Karatu' },
    ],
    required: true,
  },
  {
    id: 'marketplace_role',
    type: 'single',
    question: { en: 'Are you buying or selling?', ha: 'Kwa za ka za sirinki ko sayarwa?' },
    subtext: { en: 'What do you want to do on the marketplace?', ha: 'Menene abin da kake so yi a kasuwa?' },
    options: [
      { en: 'I want to buy items', ha: 'Ina so sirinki kaya' },
      { en: 'I want to sell items', ha: 'Ina so sayar da kaya' },
      { en: 'Both - buy and sell', ha: 'Duka - sirinki da sayarwa' },
    ],
    required: true,
  },
]

// Buyer Questions
export const buyerQuestions: Question[] = [
  {
    id: 'buy_what',
    type: 'multi',
    question: { en: 'What items would you like to buy?', ha: 'Waninne kayan da kake so sirinki?' },
    subtext: { en: 'Choose all that you need', ha: 'Zaɓi duk abin da kake bukatar' },
    options: [
      { en: 'Furniture (beds, chairs, tables)', ha: 'Kayan gida (gadon, kujera, teburi)' },
      { en: 'Textbooks and course books', ha: 'Litattafan karatu' },
      { en: 'Electronics (fans, lights, chargers)', ha: 'Kayan lantarki (farfo, fitilun, charger)' },
      { en: 'Clothes and shoes', ha: 'Kayan sutura' },
      { en: 'Kitchen items and pots', ha: 'Kayan gida da turmi' },
      { en: 'School supplies and pens', ha: 'Kayan makaranta' },
      { en: 'Other household things', ha: 'Sauran kayan gida' },
    ],
    roles: ['buyer'],
    required: true,
  },
  {
    id: 'buy_price',
    type: 'scale',
    question: { en: 'How important is the price when you buy?', ha: 'Menene mahimmancin farashin a sirinki?' },
    subtext: { en: '1 = not important, 5 = very important', ha: '1 = ba a mahimmanci, 5 = mahimmanci sosai' },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { 
      min: { en: 'Not important', ha: 'Ba a mahimmanci' },
      max: { en: 'Very important', ha: 'Mahimmanci sosai' }
    },
    roles: ['buyer'],
    required: true,
  },
  {
    id: 'buy_trust',
    type: 'multi',
    question: { en: 'What makes you trust a seller?', ha: 'Menene ya sa ka aminci ga mai sayarwa?' },
    subtext: { en: 'Choose what matters to you', ha: 'Zaɓi abin da ya mahimmaci ka' },
    options: [
      { en: 'Good reviews and ratings', ha: 'Godiyoyin da kyau' },
      { en: 'Clear photos of the item', ha: 'Hotuna madaidai na abin' },
      { en: 'They are a verified student', ha: 'Ɗalibi ɗadaɗɗen ne' },
      { en: 'Can meet them in person', ha: 'Zan iya gansu kafai' },
      { en: 'Item description is clear', ha: 'Allon abin ya tabbatacce' },
    ],
    roles: ['buyer'],
    required: true,
  },
  {
    id: 'buy_payment',
    type: 'single',
    question: { en: 'How do you want to pay?', ha: 'Yaya kake so biya?' },
    subtext: { en: 'Which payment way works best for you?', ha: 'Waninne hanyar biya ta fi kyau' },
    options: [
      { en: 'Cash when we meet', ha: 'Tsabar jiya a lokacin ganewa' },
      { en: 'Online payment or transfer', ha: 'Biya ta sakani ko jingina' },
      { en: 'Secure payment (money held safe)', ha: 'Biya maidawa (kuɗi a kulle)' },
      { en: 'No preference', ha: 'Ba ni da zaɓi' },
    ],
    roles: ['buyer'],
    required: true,
  },
]

// Seller Questions
export const sellerQuestions: Question[] = [
  {
    id: 'sell_what',
    type: 'multi',
    question: { en: 'What items do you want to sell?', ha: 'Waninne kayan da kake so sayar da su?' },
    subtext: { en: 'Choose what you have', ha: 'Zaɓi abin da kake da shi' },
    options: [
      { en: 'Furniture (beds, chairs, tables)', ha: 'Kayan gida (gadon, kujera, teburi)' },
      { en: 'Textbooks and course books', ha: 'Litattafan karatu' },
      { en: 'Electronics (fans, lights, chargers)', ha: 'Kayan lantarki (farfo, fitilun, charger)' },
      { en: 'Clothes and shoes', ha: 'Kayan sutura' },
      { en: 'Kitchen items and pots', ha: 'Kayan gida da turmi' },
      { en: 'School supplies and pens', ha: 'Kayan makaranta' },
      { en: 'Other household things', ha: 'Sauran kayan gida' },
    ],
    roles: ['seller'],
    required: true,
  },
  {
    id: 'sell_concern',
    type: 'multi',
    question: { en: 'What worries you about selling?', ha: 'Menene abin da ya damje ka game da sayarwa?' },
    subtext: { en: 'Choose what you are worried about', ha: 'Zaɓi abin da ya damje ka' },
    options: [
      { en: 'Buyer might not show up', ha: 'Sirinke ba zai zo ba' },
      { en: 'Not getting paid', ha: 'Ba in sami kuɗi ba' },
      { en: 'Scam or fraud', ha: 'Zamba ko ƙarya' },
      { en: 'Item condition not matching photos', ha: 'Abin ba ya yi kamar hoto' },
      { en: 'Safety when meeting buyers', ha: 'Tsaro a lokacin ganewa' },
      { en: 'Not having enough buyers', ha: 'Ba a da iska' },
    ],
    roles: ['seller'],
    required: true,
  },
  {
    id: 'sell_price',
    type: 'scale',
    question: { en: 'How confident are you in your pricing?', ha: 'Menene amincin ka akan farashin abin?' },
    subtext: { en: '1 = not confident, 5 = very confident', ha: '1 = ba a aminci, 5 = aminci sosai' },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { 
      min: { en: 'Not confident', ha: 'Ba a aminci' },
      max: { en: 'Very confident', ha: 'Aminci sosai' }
    },
    roles: ['seller'],
    required: true,
  },
  {
    id: 'sell_payment',
    type: 'single',
    question: { en: 'How do you want to receive payment?', ha: 'Yaya kake so karɓar kuɗi?' },
    subtext: { en: 'Which payment way works best for you?', ha: 'Waninne hanyar karɓa kuɗi ta fi kyau' },
    options: [
      { en: 'Cash when we meet', ha: 'Tsabar jiya a lokacin ganewa' },
      { en: 'Bank transfer or online', ha: 'Jingina ko biya ta sakani' },
      { en: 'Secure payment (money held safe)', ha: 'Biya maidawa (kuɗi a kulle)' },
      { en: 'No preference', ha: 'Ba ni da zaɓi' },
    ],
    roles: ['seller'],
    required: true,
  },
  {
    id: 'sell_feature',
    type: 'multi',
    question: { en: 'What features would help you sell better?', ha: 'Waninne abubuwan da za su taimake ka sayar ta kyau?' },
    subtext: { en: 'Choose all that would help', ha: 'Zaɓi duk abin da za ya taimaka' },
    options: [
      { en: 'Tools to upload many photos', ha: 'Kayan shigar da hotuna' },
      { en: 'Featured listing (show my item first)', ha: 'Nuni abin ni da farko' },
      { en: 'Buyer ratings and reviews', ha: 'Godiye da rayi masu sirinki' },
      { en: 'Private messaging with buyers', ha: 'Sanihi zunubi da masu sirinki' },
      { en: 'Safety tips and guides', ha: 'Shawara game da tsaro' },
    ],
    roles: ['seller'],
    required: true,
  },
]

// General Questions
export const generalQuestions: Question[] = [
  {
    id: 'marketplace_use',
    type: 'scale',
    question: { en: 'How much would you use the marketplace?', ha: 'Yatsan yaya za ka amfani da kasuwa?' },
    subtext: { en: '1 = rarely, 5 = very often', ha: '1 = kadan, 5 = sau da yawa' },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { 
      min: { en: 'Rarely', ha: 'Kadan' },
      max: { en: 'Very often', ha: 'Sau da yawa' }
    },
    required: true,
  },
  {
    id: 'features_want',
    type: 'multi',
    question: { en: 'What other features do you want?', ha: 'Waninne sauran abubuwan da kake so?' },
    subtext: { en: 'Choose what interests you', ha: 'Zaɓi abin da ya sha kan ka' },
    options: [
      { en: 'Search filters and categories', ha: 'Sakewa da abubuwan' },
      { en: 'Wishlist or saved items', ha: 'Rubuta abubuwan da na so' },
      { en: 'See seller feedback and ratings', ha: 'Duba rayin mai sayarwa' },
      { en: 'Item delivery options', ha: 'Abubuwan ishe abin' },
      { en: 'Buyer protection guarantee', ha: 'Kariya kan sirinke' },
      { en: 'Chat/messaging with sellers', ha: 'Salanke da mai sayarwa' },
      { en: 'Commission-free selling', ha: 'Sayarwa ba tare da kuɗi' },
    ],
    required: true,
  },
  {
    id: 'feedback',
    type: 'text',
    question: { en: 'Anything else you want to tell us?', ha: 'Ba wani abu da kake so sanar muni?' },
    subtext: { en: 'Ideas, worries, or anything on your mind', ha: 'Ra\'ayi, damje, ko wani abu' },
    required: false,
  },
]

// Export all questions
export const getAllQuestions = (language: Language, role?: string): Question[] => {
  return [
    ...setupQuestions,
    ...buyerQuestions.filter(q => !q.roles || q.roles.includes('buyer')),
    ...(role === 'seller' || role === 'both' ? 
      sellerQuestions.filter(q => !q.roles || q.roles.includes('seller')) : 
      []),
    ...generalQuestions,
  ]
}
