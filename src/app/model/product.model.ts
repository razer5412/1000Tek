export interface SubCategory {
  name: string;
  url: string;
}

export interface CategorySection {
  title: string;
  items: SubCategory[];
}

export interface Category {
  id: number;
  name: string;
  url: string;
  sections: CategorySection[];
}
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  inStock: boolean;

  category: string;        // ex: "Informatique"
  section: string;         // ex: "Ordinateur Portable"
  subCategory: string;     // ex: "Pc Portable Gamer"
}
