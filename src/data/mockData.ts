import { Customer, Order } from '../store/useShopStore';

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', joinDate: '2024-01-15', totalOrders: 5, totalSpent: 12500 },
  { id: 'c2', name: 'Priya Patel', email: 'priya@example.com', role: 'user', joinDate: '2024-02-10', totalOrders: 3, totalSpent: 8200 },
  { id: 'c3', name: 'Amit Kumar', email: 'amit@example.com', role: 'user', joinDate: '2024-03-01', totalOrders: 1, totalSpent: 4500 },
  { id: 'c4', name: 'Sneha Gupta', email: 'sneha@example.com', role: 'user', joinDate: '2024-03-05', totalOrders: 2, totalSpent: 3200 },
];

export const mockOrders: Order[] = [
  { 
    id: 'VNTG-8829', 
    customerName: 'Rahul Sharma', 
    customerEmail: 'rahul@example.com', 
    date: '2024-03-17', 
    status: 'Processing', 
    total: 4500, 
    items: [{ productId: '1', name: 'Essential Oversized Hoodie', quantity: 2, price: 1850 }] 
  },
  { 
    id: 'VNTG-8828', 
    customerName: 'Priya Patel', 
    customerEmail: 'priya@example.com', 
    date: '2024-03-16', 
    status: 'Shipped', 
    total: 2200, 
    items: [{ productId: '3', name: 'Boxy Heavy Tee', quantity: 2, price: 850 }] 
  },
  { 
    id: 'VNTG-8827', 
    customerName: 'Amit Kumar', 
    customerEmail: 'amit@example.com', 
    date: '2024-03-15', 
    status: 'Delivered', 
    total: 8900, 
    items: [{ productId: '10', name: 'Minimalist Leather Sneakers', quantity: 4, price: 1999 }] 
  },
];
