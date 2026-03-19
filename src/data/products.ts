import { Product } from '../store/useShopStore';

export const products: Product[] = [
  {
    id: '1',
    name: 'Essential Oversized Hoodie',
    price: 1850,
    description: 'A premium heavyweight cotton hoodie with a relaxed, oversized fit. Features dropped shoulders and a double-layered hood for a structured look.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx', 'Bone', 'Slate'],
    inStock: true,
    isTrending: true,
    isNew: true,
    discount: 15
  },
  {
    id: '2',
    name: 'Cargo Tech Pants',
    price: 1950,
    description: 'Water-resistant technical pants with multiple utility pockets and adjustable ankle cuffs. Designed for both urban exploration and daily wear.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Black', 'Olive'],
    inStock: true,
    isTrending: true,
    discount: 10
  },
  {
    id: '3',
    name: 'Boxy Heavy Tee',
    price: 850,
    description: '280GSM heavy cotton t-shirt with a boxy silhouette. Pre-shrunk and garment-dyed for a vintage feel.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Vintage Black', 'Sand'],
    inStock: true,
    isNew: true
  },
  {
    id: '10',
    name: 'Minimalist Leather Sneakers',
    price: 1999,
    description: 'Clean, low-top sneakers crafted from premium Italian calf leather. Features a durable Margom rubber sole and waxed cotton laces.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['White', 'Black'],
    inStock: true,
    isTrending: true,
    isNew: true,
    discount: 25
  },
  {
    id: '11',
    name: 'Tech Runner Shoes',
    price: 1899,
    description: 'High-performance urban runners with a breathable mesh upper and responsive cushioning. Features reflective details for night visibility.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Neon Grey', 'Triple Black'],
    inStock: true,
    isNew: true
  },
  {
    id: '12',
    name: 'Suede Chelsea Boots',
    price: 1999,
    description: 'Classic Chelsea boots made from water-repellent Italian suede. Features a pull tab and elastic side panels for easy wear.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Sand', 'Chocolate'],
    inStock: true,
    isTrending: true,
    discount: 30
  },
  {
    id: '4',
    name: 'Minimalist Bomber Jacket',
    price: 1999,
    description: 'A sleek, padded bomber jacket with a matte finish. Features premium Riri zippers and a hidden internal pocket.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy', 'Black'],
    inStock: true,
    discount: 20
  },
  {
    id: '13',
    name: 'Graphite Knit Sweater',
    price: 1450,
    description: 'Soft wool-blend knit sweater with a textured finish. Perfect for layering during colder months.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Graphite', 'Cream'],
    inStock: true,
    isTrending: true
  },
  {
    id: '7',
    name: 'Leather Utility Belt',
    price: 650,
    description: 'Handcrafted full-grain leather belt with a matte black buckle and modular attachment points.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Tan'],
    inStock: true,
    isNew: true
  },
  {
    id: '8',
    name: 'Structured 5-Panel Cap',
    price: 450,
    description: 'Water-repellent nylon cap with a structured crown and adjustable webbing strap.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Olive', 'Grey'],
    inStock: true,
    isTrending: true
  },
  {
    id: '14',
    name: 'Silver Link Bracelet',
    price: 1250,
    description: '925 Sterling silver link bracelet with a custom industrial clasp. Hand-polished finish.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Silver'],
    inStock: true,
    isNew: true
  },
  {
    id: '15',
    name: 'Canvas Weekender Bag',
    price: 1650,
    description: 'Durable canvas bag with leather trim and a spacious main compartment. Features a detachable shoulder strap and multiple internal pockets.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1544816153-12ad5d7133a2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Olive', 'Black'],
    inStock: true,
    isTrending: true
  },
  {
    id: '16',
    name: 'Urban Combat Boots',
    price: 1999,
    description: 'Rugged yet refined combat boots featuring a thick lug sole and premium full-grain leather. Built for durability and style.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1520639889313-7272170b1c39?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Matte Black', 'Dark Brown'],
    inStock: true,
    isNew: true
  },
  {
    id: '17',
    name: 'Retro High-Top Sneakers',
    price: 1750,
    description: 'Vintage-inspired high-top sneakers with a distressed finish. Features a padded collar and classic vulcanized sole.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Off-White', 'Classic Black'],
    inStock: true,
    isTrending: true
  },
  {
    id: '18',
    name: 'Minimalist Slip-on Loafers',
    price: 1850,
    description: 'Sleek slip-on loafers crafted from soft nubuck leather. Features a flexible rubber sole for all-day comfort.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Sand', 'Charcoal'],
    inStock: true,
    isTrending: true
  },
  {
    id: '19',
    name: 'Polarized Wayfarer Sunglasses',
    price: 950,
    description: 'Classic wayfarer silhouette with polarized lenses and a matte black frame. Provides 100% UV protection.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise'],
    inStock: true,
    isNew: true
  },
  {
    id: '20',
    name: 'Minimalist Card Holder',
    price: 450,
    description: 'Slim card holder made from vegetable-tanned leather. Features four card slots and a central pocket for cash.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Tan', 'Navy'],
    inStock: true,
    isTrending: true
  },
  {
    id: '21',
    name: 'Technical Backpack',
    price: 1950,
    description: 'Water-resistant roll-top backpack with a padded laptop sleeve and modular attachment points. Ideal for daily commutes.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Olive'],
    inStock: true,
    isNew: true
  },
  {
    id: '22',
    name: 'Merino Wool Beanie',
    price: 350,
    description: 'Soft and warm beanie made from 100% extra-fine Merino wool. Features a classic ribbed design and a folded cuff.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d43c95c?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Grey', 'Black', 'Navy'],
    inStock: true,
    isTrending: true
  },
  {
    id: '23',
    name: 'Stainless Steel Watch',
    price: 1999,
    description: 'Minimalist analog watch with a stainless steel case and a sapphire crystal lens. Water-resistant up to 50 meters.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['38mm', '40mm', '42mm'],
    colors: ['Silver', 'Black'],
    inStock: true,
    isNew: true
  },
  {
    id: '24',
    name: 'Leather Key Organizer',
    price: 250,
    description: 'Quiet and organized key holder made from premium leather. Eliminates key jingle and protects your belongings.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Tan'],
    inStock: true,
    isTrending: true
  },
  {
    id: '25',
    name: 'Silk Pocket Square',
    price: 150,
    description: 'Hand-rolled silk pocket square with a subtle geometric pattern. Adds a touch of elegance to any blazer.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Burgundy', 'Navy'],
    inStock: true,
    isNew: true
  },
  {
    id: '26',
    name: 'Cashmere Scarf',
    price: 950,
    description: 'Luxuriously soft scarf made from 100% pure cashmere. Features a classic fringe detail at the ends.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Camel', 'Charcoal'],
    inStock: true,
    isTrending: true
  },
  {
    id: '27',
    name: 'Braided Leather Bracelet',
    price: 350,
    description: 'Hand-braided leather bracelet with a magnetic stainless steel clasp. A subtle and stylish addition to your wrist.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L'],
    colors: ['Black', 'Brown'],
    inStock: true,
    isNew: true
  },
  {
    id: '28',
    name: 'Heavy Canvas Tote Bag',
    price: 550,
    description: 'Durable 18oz canvas tote bag with reinforced handles and an internal zip pocket. Perfect for daily essentials.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1544816153-12ad5d7133a2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Natural', 'Black'],
    inStock: true,
    isTrending: true
  },
  {
    id: '29',
    name: 'Minimalist Automatic Umbrella',
    price: 450,
    description: 'Compact and windproof automatic umbrella with a matte black handle and a high-density canopy.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1527664557558-a2b352fc3305?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Black'],
    inStock: true,
    isNew: true
  },
  {
    id: '30',
    name: 'Vintage Denim Jacket',
    price: 1650,
    description: 'Classic trucker jacket in a washed indigo denim. Features reinforced stitching and custom metal buttons.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1576905341935-4ef24434494f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Indigo', 'Light Wash'],
    inStock: true,
    isTrending: true
  },
  {
    id: '31',
    name: 'Slim Fit Chinos',
    price: 1250,
    description: 'Versatile slim-fit chinos made from a comfortable stretch-cotton twill. Perfect for both casual and semi-formal occasions.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Khaki', 'Navy', 'Olive'],
    inStock: true,
    isNew: true
  },
  {
    id: '32',
    name: 'Premium Linen Shirt',
    price: 1150,
    description: 'Breathable 100% linen shirt with a relaxed collar. Ideal for warm weather and beach outings.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Sky Blue', 'Sand'],
    inStock: true,
    isTrending: true
  },
  {
    id: '33',
    name: 'Leather Biker Jacket',
    price: 4500,
    description: 'Iconic asymmetric biker jacket crafted from supple lambskin leather. Features silver-tone hardware and a quilted lining.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    inStock: true,
    isTrending: true,
    isNew: true
  },
  {
    id: '34',
    name: 'Classic Desert Boots',
    price: 1450,
    description: 'Timeless desert boots in premium suede with a natural crepe sole. A staple for any modern wardrobe.',
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Oak', 'Grey'],
    inStock: true,
    isTrending: true
  },
  {
    id: '35',
    name: 'Aviator Sunglasses',
    price: 1250,
    description: 'Classic aviator frames with polarized teardrop lenses. Lightweight and durable for all-day wear.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Gold/Green', 'Silver/Black'],
    inStock: true,
    isNew: true
  },
  {
    id: '36',
    name: 'Leather Messenger Bag',
    price: 2450,
    description: 'Sophisticated messenger bag made from pebbled leather. Features a padded laptop compartment and adjustable strap.',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Cognac', 'Black'],
    inStock: true,
    isTrending: true
  },
  {
    id: '37',
    name: 'Wool Overcoat',
    price: 3850,
    description: 'Elegant single-breasted overcoat in a heavy wool blend. Features notched lapels and a clean, tailored silhouette.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Camel', 'Navy', 'Charcoal'],
    inStock: true,
    isNew: true,
    isTrending: true
  },
  {
    id: '38',
    name: 'Tech Jogger Sweatpants',
    price: 950,
    description: 'Modern joggers with a tapered fit and technical fabric. Features zip pockets and an elasticated waistband.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1580906853203-f493cea9ff28?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Heather Grey', 'Black'],
    inStock: true,
    isTrending: true
  }
];
