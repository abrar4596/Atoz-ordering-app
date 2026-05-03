/** Sample supplement product — replace with API props later */
export const sampleSupplementProduct = {
  id: 'wpi-on-001',
  name: 'Whey Protein Isolate',
  brand: 'Optimum Nutrition',
  href: '#',
  description:
    'Premium whey protein isolate with fast absorption for post-workout recovery. Low lactose, high purity, and great mixability for daily training support.',
  breadcrumbs: [
    { id: 1, name: 'Supplements', href: '#' },
    { id: 2, name: 'Protein', href: '#' },
  ],
  price: 2499,
  mrp: 3199,
  currency: '₹',
  flavors: ['Chocolate', 'Vanilla'],
  weightOptions: [
    { value: '1kg', inStock: true },
    { value: '2kg', inStock: true },
  ],
  servingSize: '30g per scoop',
  servingsPerContainer: 30,
  proteinPerServing: '24g',
  ingredients: [
    'Whey Protein Isolate (milk)',
    'Cocoa powder (processed with alkali)',
    'Natural & artificial flavors',
    'Lecithin (soy)',
    'Salt',
    'Acesulfame potassium',
    'Sucralose',
    'Lactase',
  ],
  nutritionalFacts: [
    { label: 'Calories', value: '120', perServing: true },
    { label: 'Protein', value: '24g', perServing: true },
    { label: 'Carbs', value: '3g', perServing: true },
    { label: 'Fats', value: '1g', perServing: true },
  ],
  usageInstructions:
    'Mix 1 scoop (30g) with 200–250ml cold water or milk. Shake well for 20–30 seconds. Consume within 30 minutes after workout, or as a snack between meals.',
  benefits: [
    'Supports lean muscle growth',
    'Faster post-workout recovery',
    'High protein, low sugar per serving',
    'Easy mixing — smooth texture',
  ],
  warnings:
    'Not for medical use. Consult a physician if pregnant, nursing, or under medication. Contains milk and soy. Store in a cool, dry place. Keep out of reach of children.',
  stockStatus: 'in_stock',
  lowStockThreshold: 5,
  images: [
    {
      src: 'https://images.unsplash.com/photo-1593095948071-824c8aabc85f?w=900&h=900&fit=crop',
      alt: 'Whey protein powder tub on dark surface',
    },
    {
      src: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=900&h=900&fit=crop',
      alt: 'Protein shake in a shaker bottle',
    },
    {
      src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=900&fit=crop',
      alt: 'Gym training dumbbells — fitness lifestyle',
    },
    {
      src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&h=900&fit=crop',
      alt: 'Healthy nutrition and supplements flat lay',
    },
  ],
}

export const sampleReviews = {
  href: '#reviews',
  average: 4.5,
  totalCount: 284,
}
