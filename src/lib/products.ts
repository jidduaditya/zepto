export interface Product {
  name: string;
  brand: string;
  price: number;
  weight: string;
  imageColor: string;
  image?: string;
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
    image: "https://lh3.googleusercontent.com/aida/ADBb0ug8bz60adta9arN9KW41tvpMJfqZfPBa34QXQEXI7f6tGdWP6nL8wAG-HpKWxkm-Q36UDeFQTks2gVxNk42BQwyWVxgQ04Fgq9D0zklyjCVzWROdUf5PvP6AfNAnZ0uOmEeV9WVN8T8uIIg2ti8c5xoDTHAxHLOQ7fd3ED0Y1a7PzDGn43stBn5ozEYrxyDKGAww-FyzYSM8soZucKvpOAJ5_Zc07nOlw3e4zbPxtFMr7NhccXMM7-rtCU",
  },
  {
    name: "Butterscotch Bliss",
    brand: "Amul",
    price: 175,
    weight: "500 ml",
    imageColor: "#D4A843",
    image: "https://lh3.googleusercontent.com/aida/ADBb0uiVfWNU_OyZZIgrMcrsKngdfPG2MBz7ajsEIkh6VxBC3NzoPiXSyOOMB6CmK8r_72jnsilvLe0_pe0G7nfWvA8CyV7bm9zSwMkkdBH1TRSyZdgQHDOPqQAXAQcsUmR2eB6btwxFL5OOjW2a3UwcjjuT9Tkt6Ee4sNHMsIOG8YxPHe34GFLvBQrwRP4PBmDn--Cp04Sq-wwAriaUC9QV6N5SpH4sdjA14oCukdMSIte9L8pp1VCD-hjeVA",
  },
  {
    name: "Mango Dolly",
    brand: "Mother Dairy",
    price: 40,
    weight: "60 ml",
    imageColor: "#F5A623",
    image: "https://lh3.googleusercontent.com/aida/ADBb0uhaIE4WiKsdDVZSqPrW7fc5R4IwMvoEWwdsgdL7q2Q2xbufVa8Kw7z5ohnnRJyba8_8r5cTFQpWaGB9d17723XT0mnBY8sskzBz6MbYCNQuDwLo7Hc8-AxMGCYnW50b1awlsChE_-si6nrPiwvwIKDlC1NSolv244IpXP6afi2AmtNjcuIfkHRI5LDi5yZvA1LTAkZQDrnmQsmYKM15lzySoq5KuO7mZmckV5mHf-slKUzthp9sZLXVrE0",
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
