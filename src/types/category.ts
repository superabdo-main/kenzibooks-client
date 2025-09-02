import { Product } from "./products.type";

export type Category = {
    id: string;
    name: string;
    productCount: number;
    products: Product[];
}