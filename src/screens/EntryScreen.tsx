import { motion } from "framer-motion";
import { ProductCard } from "../components/ProductCard";

interface EntryScreenProps {
  onSing: () => void;
}

const CATEGORIES = [
  { icon: "icecream", label: "Scoops", bg: "bg-primary-fixed", color: "text-primary" },
  { icon: "local_pizza", label: "Snacks", bg: "bg-secondary-fixed", color: "text-secondary" },
  { icon: "local_cafe", label: "Beverages", bg: "bg-tertiary-fixed", color: "text-tertiary" },
  { icon: "cake", label: "Desserts", bg: "bg-primary-fixed", color: "text-primary" },
];

const PRODUCTS = [
  {
    name: "Belgian Chocolate Tub",
    brand: "Kwality Wall's",
    price: 224,
    originalPrice: 249,
    weight: "700 ml",
    imageColor: "#4A2C2A",
    image: "https://lh3.googleusercontent.com/aida/ADBb0ug8bz60adta9arN9KW41tvpMJfqZfPBa34QXQEXI7f6tGdWP6nL8wAG-HpKWxkm-Q36UDeFQTks2gVxNk42BQwyWVxgQ04Fgq9D0zklyjCVzWROdUf5PvP6AfNAnZ0uOmEeV9WVN8T8uIIg2ti8c5xoDTHAxHLOQ7fd3ED0Y1a7PzDGn43stBn5ozEYrxyDKGAww-FyzYSM8soZucKvpOAJ5_Zc07nOlw3e4zbPxtFMr7NhccXMM7-rtCU",
    discount: "10% OFF",
  },
  {
    name: "Butterscotch Bliss",
    brand: "Amul",
    price: 175,
    weight: "500 ml",
    imageColor: "#D4A843",
    image: "https://lh3.googleusercontent.com/aida/ADBb0uiVfWNU_OyZZIgrMcrsKngdfPG2MBz7ajsEIkh6VxBC3NzoPiXSyOOMB6CmK8r_72jnsilvLe0_pe0G7nfWvA8CyV7bm9zSwMkkdBH1TRSyZdgQHDOPqQAXAQcsUmR2eB6btwxFL5OOjW2a3UwcjjuT9Tkt6Ee4sNHMsIOG8YxPHe34GFLvBQrwRP4PBmDn--Cp04Sq-wwAriaUC9QV6N5SpH4sdjA14oCukdMSIte9L8pp1VCD-hjeVA",
    badge: "BEST VALUE",
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
];

export function EntryScreen({ onSing }: EntryScreenProps) {
  return (
    <div className="flex flex-col">
      {/* Zepto-style header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          {/* Zepto logo */}
          <span className="font-heading text-[22px] font-extrabold text-primary italic tracking-tight">zepto</span>
          <div className="h-5 w-px bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined fill text-primary text-[18px]">location_on</span>
            <span className="text-[13px] text-on-surface font-semibold flex items-center gap-0.5">
              8 min
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">expand_more</span>
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            readOnly
            className="w-full bg-surface-container-high border-none rounded-full py-2.5 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none"
            placeholder="Search for ice cream, snacks..."
          />
        </div>
      </div>

      {/* Sing for Your Cream hero banner */}
      <div className="mx-4 mt-2 mb-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform duration-200"
          onClick={onSing}
        >
          <div className="aspect-[1.97/1] w-full relative bg-gradient-to-r from-secondary to-primary">
            {/* Decorative circles */}
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -right-10 top-10 w-20 h-20 bg-white/5 rounded-full" />
            <div className="absolute left-4 bottom-4 w-12 h-12 bg-white/10 rounded-full" />

            <div className="absolute inset-0 flex items-center p-5">
              <div className="max-w-[70%] space-y-2">
                <h1 className="font-heading text-[22px] font-extrabold text-on-primary leading-tight">
                  Sing for your<br />Scoop!
                </h1>
                <p className="text-[13px] text-on-primary/90 leading-snug">
                  Click to record and earn discounts on ice cream.
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 bg-surface-white text-secondary font-[Inter] text-[12px] font-bold tracking-wider px-4 py-2 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">mic</span>
                    START RECORDING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <h2 className="font-heading text-[20px] font-bold text-on-surface mb-3">Explore Categories</h2>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="min-w-[72px] flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center shadow-sm`}>
                <span className={`material-symbols-outlined fill text-[28px] ${cat.color}`}>{cat.icon}</span>
              </div>
              <span className="text-[13px] text-on-surface text-center">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Scoops */}
      <div className="px-4 pb-6">
        <h2 className="font-heading text-[20px] font-bold text-on-surface mb-3">Trending Scoops</h2>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
