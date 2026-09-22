export interface CreateProductInput {


  sku: string;


  name: string;


  category: string;


  imageUrl?: string;


  price: number;


  stock?: number;


}



export interface UpdateProductInput {


  name?: string;


  category?: string;


  imageUrl?: string;


  price?: number;


  stock?: number;


  isActive?: boolean;


}