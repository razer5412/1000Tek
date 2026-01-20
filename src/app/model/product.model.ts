
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand?: string;
  inStock?: boolean;
  rating?: number;
}

export interface Category {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}