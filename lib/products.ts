// lib/products.ts
export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl: string;
  imagePublicId: string;
};

export const products: Product[] = [
  {
    name: "Dangote Flour",
    category: "🌾 Flour",
    price: 50500,
    unit: "50kg",
    imagePublicId: "qdjt24euuijwhm2zldz5",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/qdjt24euuijwhm2zldz5",
    _id: "1"
  },
  {
    name: "Mix and bake flour",
    category: "🌾 Flour",
    price: 50500,
    unit: "50kg",
    imagePublicId: "pnpsmhofjerr2fxh05uu",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/pnpsmhofjerr2fxh05uu",
    _id: "2"
  },
  {
    name: "Gerawa rice 50kg",
    category: "🍚 Rice",
    price: 52000,
    unit: "50kg bag",
    imagePublicId: "",
     imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/v1777648694/gerawa_rice_ckxngx.jpg", 
    _id: "3"
  },
  {
    name: "Rano rice 50kg",
    category: "🍚 Rice",
    price: 58500,
    unit: "50kg bag",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "4"
  },
  {
    name: "Vitali Thailand rice",
    category: "🍚 Rice",
    price: 59000,
    unit: "50kg bag",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "5"
  },
  {
    name: "ISHU Thailand rice",
    category: "🍚 Rice",
    price: 56000,
    unit: "50kg bag",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "6"
  },
  {
    name: "Mafa rice 50kg",
    category: "🍚 Rice",
    price: 51000,
    unit: "50kg bag",
    imagePublicId: "n9hd79ez1q13mnbrc5fr",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/n9hd79ez1q13mnbrc5fr",
    _id: "7"
  },
  {
    name: "Falgold rice 50kg",
    category: "🍚 Rice",
    price: 51000,
    unit: "50kg bag",
    imagePublicId: "ja8lm9ayc5wyj0idomcv",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/ja8lm9ayc5wyj0idomcv",
    _id: "8"
  },
  {
    name: "Falgold rice 25kg",
    category: "🍚 Rice",
    price: 26000,
    unit: "25kg bag",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "9"
  },
  {
    name: "Zyn parboiled Rice 50kg",
    category: "🍚 Rice",
    price: 50500,
    unit: "50kg bag",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "10"
  },
  {
    name: "Golden sella Basmati rice 5kg",
    category: "🍚 Rice",
    price: 63000,
    unit: "per carton",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "11"
  },
  {
    name: "Indomie super pack",
    category: "🍜 Noodles & Pasta",
    price: 14500,
    unit: "carton",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "12"
  },
  {
    name: "Indomie small pack",
    category: "🍜 Noodles & Pasta",
    price: 10000,
    unit: "carton",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "13"
  },
  {
    name: "Crown spaghetti",
    category: "🍜 Noodles & Pasta",
    price: 18000,
    unit: "carton",
    imagePublicId: "uvl5o35iqxckve0o4geo",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/uvl5o35iqxckve0o4geo",
    _id: "14"
  },
  {
    name: "Macaroni crown",
    category: "🍜 Noodles & Pasta",
    price: 18000,
    unit: "carton",
    imagePublicId: "o8lax1erhglxqdx5cs6l",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/o8lax1erhglxqdx5cs6l",
    _id: "15"
  },
  {
    name: "Zyn vegetable oil",
    category: "🛢️ Oils",
    price: 58500,
    unit: "25 litres",
    imagePublicId: "fpou2byf192vbk028vku",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/fpou2byf192vbk028vku",
    _id: "16"
  },
  {
    name: "Crystal vegetable oil",
    category: "🛢️ Oils",
    price: 58500,
    unit: "25 litres",
    imagePublicId: "khb9is5qn9ixn7sykweg",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/khb9is5qn9ixn7sykweg",
    _id: "17"
  },
  {
    name: "Sabza vegetable oil",
    category: "🛢️ Oils",
    price: 58500,
    unit: "25 litres",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "18"
  },
  {
    name: "Kings oil 5ltrs",
    category: "🛢️ Oils",
    price: 62000,
    unit: "5 litres",
    imagePublicId: "ndlaq5onyrpvyilusvcu",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/ndlaq5onyrpvyilusvcu",
    _id: "19"
  },
  {
    name: "Kings oil 25ltrs",
    category: "🛢️ Oils",
    price: 66500,
    unit: "25 litres",
    imagePublicId: "sggg4jgivwpxttiw5jmv",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/sggg4jgivwpxttiw5jmv",
    _id: "20"
  },
  {
    name: "Zyn Shea butter cooking",
    category: "🛢️ Oils",
    price: 37000,
    unit: "25 litres",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "21"
  },
  {
    name: "Maltina pack",
    category: "🥤 Beverages",
    price: 12000,
    unit: "carton (12 cans)",
    imagePublicId: "pz0vcu5fyznpzoajb1lo",
    imageUrl: "https://res.cloudinary.com/dhysswdl7/image/upload/pz0vcu5fyznpzoajb1lo",
    _id: "22"
  },
  {
    name: "Mr V table water",
    category: "💧 Water",
    price: 2100,
    unit: "per pack",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "23"
  },
  {
    name: "Issa tasty tomato paste 400g",
    category: "🥫 Tomato Paste",
    price: 23000,
    unit: "carton",
    imagePublicId: "",
    imageUrl: "/placeholder.png",
    _id: "24"
  }
];

export const getProductImage = (product: Product) => {
  if (product.imageUrl && !product.imageUrl.includes("/placeholder.png"))
    return product.imageUrl;
  return "/placeholder.png";
};