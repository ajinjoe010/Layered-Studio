import { Product } from '../store/useShopStore';
import { products as initialProducts } from './products';

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
  items: number;
}

export const mockCustomers: Customer[] = [
  { id: 'C-1001', name: 'Rahul Sharma', email: 'rahul.s@example.com', orders: 5, totalSpent: '₹22,500', status: 'Active', joinDate: 'Jan 12, 2024' },
  { id: 'C-1002', name: 'Priya Patel', email: 'priya.p@example.com', orders: 3, totalSpent: '₹12,200', status: 'Active', joinDate: 'Feb 05, 2024' },
  { id: 'C-1003', name: 'Amit Kumar', email: 'amit.k@example.com', orders: 8, totalSpent: '₹45,900', status: 'Active', joinDate: 'Nov 20, 2023' },
  { id: 'C-1004', name: 'Sneha Gupta', email: 'sneha.g@example.com', orders: 1, totalSpent: '₹1,200', status: 'Inactive', joinDate: 'Mar 01, 2024' },
  { id: 'C-1005', name: 'Vikram Singh', email: 'vikram.s@example.com', orders: 12, totalSpent: '₹88,400', status: 'Active', joinDate: 'Oct 15, 2023' },
];

export const mockOrders: Order[] = [
  { id: 'VNTG-8829', customer: 'Rahul Sharma', date: '2024-03-17', status: 'Processing', total: '₹4,500', items: 2 },
  { id: 'VNTG-8828', customer: 'Priya Patel', date: '2024-03-16', status: 'Shipped', total: '₹2,200', items: 1 },
  { id: 'VNTG-8827', customer: 'Amit Kumar', date: '2024-03-15', status: 'Delivered', total: '₹8,900', items: 4 },
  { id: 'VNTG-8826', customer: 'Sneha Gupta', date: '2024-03-14', status: 'Processing', total: '₹1,200', items: 1 },
  { id: 'VNTG-8825', customer: 'Vikram Singh', date: '2024-03-13', status: 'Delivered', total: '₹15,600', items: 3 },
];
