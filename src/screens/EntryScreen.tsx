import { motion } from "framer-motion";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";

interface EntryScreenProps {
  onSing: () => void;
}

const PRODUCTS = [
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
];

export function EntryScreen({ onSing }: EntryScreenProps) {
  return (
    <div className="flex flex-col">
      {/* Category header */}
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-[22px] font-bold text-zepto-text">Ice Cream</h1>
        <p className="text-[13px] text-zepto-text-secondary mt-0.5">
          Delivered in 10 minutes
        </p>
      </div>

      {/* Sing for Your Scoop banner */}
      <div className="mx-4 mt-2 mb-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-zepto-purple to-zepto-pink rounded-2xl p-5 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-8 top-8 w-16 h-16 bg-white/5 rounded-full" />

          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
            New
          </p>
          <h2 className="text-[24px] font-bold mt-1 leading-tight">
            Sing for
            <br />
            Your Scoop
          </h2>
          <p className="text-[13px] mt-2 opacity-90 leading-snug">
            Sing "ice cream" and unlock up to 20% off. The better you sing, the
            bigger the discount.
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={onSing}
            >
              <span className="text-zepto-purple font-bold">
                Try it now
              </span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Product grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
