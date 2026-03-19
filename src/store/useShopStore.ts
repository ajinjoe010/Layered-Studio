import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../data/products';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  discount?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
  }[];
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface ShopState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  customers: Customer[];
  orders: Order[];
  
  // Cart actions
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;

  // Admin actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
  
  setCustomers: (customers: Customer[]) => void;
  removeCustomer: (customerId: string) => void;
  
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      products: initialProducts,
      cart: [],
      wishlist: [],
      customers: [
        {
          id: 'c1',
          name: 'Alex Rivera',
          email: 'alex@example.com',
          role: 'user',
          joinDate: '2024-01-15',
          totalOrders: 3,
          totalSpent: 12450.00
        },
        {
          id: 'c2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          role: 'user',
          joinDate: '2024-02-01',
          totalOrders: 1,
          totalSpent: 1950.00
        },
        {
          id: 'c3',
          name: 'Admin User',
          email: 'ajinjoe010@gmail.com',
          role: 'admin',
          joinDate: '2024-01-01',
          totalOrders: 0,
          totalSpent: 0
        }
      ],
      orders: [
        {
          id: 'o1',
          customerName: 'Alex Rivera',
          customerEmail: 'alex@example.com',
          date: '2024-03-10',
          status: 'Delivered',
          total: 1850.00,
          items: [
            { 
              productId: '1', 
              name: 'Essential Oversized Hoodie', 
              quantity: 1, 
              price: 1850,
              size: 'L',
              color: 'Charcoal',
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'
            }
          ],
          shippingAddress: {
            fullName: 'Alex Rivera',
            address: '123 Maple Avenue',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001'
          }
        },
        {
          id: 'o2',
          customerName: 'Sarah Chen',
          customerEmail: 'sarah@example.com',
          date: '2024-03-15',
          status: 'Processing',
          total: 1950.00,
          items: [
            { 
              productId: '2', 
              name: 'Cargo Tech Pants', 
              quantity: 1, 
              price: 1950,
              size: 'M',
              color: 'Olive',
              image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800'
            }
          ],
          shippingAddress: {
            fullName: 'Sarah Chen',
            address: '456 Lotus Lane',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001'
          }
        }
      ],

      addToCart: (product, size, color) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.selectedSize === size && item.selectedColor === color
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1, selectedSize: size, selectedColor: color }] };
        }),
      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      clearCart: () => set({ cart: [] }),

      // Admin actions
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      removeProduct: (productId) => set((state) => ({ 
        products: state.products.filter(p => p.id !== productId),
        cart: state.cart.filter(item => item.id !== productId),
        wishlist: state.wishlist.filter(id => id !== productId)
      })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      })),

      setCustomers: (customers) => set({ customers }),
      removeCustomer: (customerId) => set((state) => ({
        customers: state.customers.filter(c => c.id !== customerId)
      })),

      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
    }),
    {
      name: 'layered-shop-storage',
    }
  )
);
