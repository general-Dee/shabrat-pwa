export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
};