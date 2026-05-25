export interface Product {
  name: string;
  brand: string;
  price: number;
  weight: string;
  imageColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const ICE_CREAM_PRODUCTS: Product[] = [
  {
    name: "Belgian Chocolate Tub",
    brand: "Kwality Wall's",
    price: 249,
    weight: "700 ml",
    imageColor: "#4A2C2A",
  },
  {
    name: "Butterscotch Bliss",
    brand: "Amul",
    price: 175,
    weight: "500 ml",
    imageColor: "#D4A843",
  },
  {
    name: "Mango Dolly",
    brand: "Mother Dairy",
    price: 40,
    weight: "60 ml",
    imageColor: "#F5A623",
  },
  {
    name: "Vanilla Cup",
    brand: "Havmor",
    price: 30,
    weight: "80 ml",
    imageColor: "#FAF0DC",
  },
  {
    name: "Strawberry Sundae",
    brand: "Baskin Robbins",
    price: 199,
    weight: "450 ml",
    imageColor: "#E8567F",
  },
  {
    name: "Kesar Pista Kulfi",
    brand: "Amul",
    price: 60,
    weight: "80 ml",
    imageColor: "#C5A55A",
  },
];
