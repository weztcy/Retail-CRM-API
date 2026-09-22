export interface CreateProductInput {


  sku: string;


  name: string;


  category: string;


  price: number;


  stock?: number;


  imageUrl?: string;


}



export interface UpdateProductInput {

  name?: string;

  category?: string;

  price?: number;

  stock?: number;

  isActive?: boolean;

  imageUrl?: string;

}