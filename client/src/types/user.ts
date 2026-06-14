// src/types/user.ts

// Represents a user in the system
export interface User {
  id: string;                  // Unique user ID
  name: string;                // Full name
  email: string;               // Email address
  role: 'admin' | 'hunter' | 'realtor'; // User role
  phone?: string;              // Optional phone number
  createdAt?: string;          // Optional: when the user account was created
  updatedAt?: string;          // Optional: last update timestamp
  isActive?: boolean;          // Optional: account active status
}