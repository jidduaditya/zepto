import { motion } from "framer-motion";
import { ProductCard } from "../components/ProductCard";
import { ICE_CREAM_PRODUCTS, type Product } from "../lib/products";

interface ShopScreenProps {
  discount: number;
  onBack: () => void;
  getQuantity: (name: string) => number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (name: string) => void;
}

export function ShopScreen({ discount, onBack, getQuantity, onAddToCart, onRemoveFromCart }: ShopScreenProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h1 className="font-heading text-[20px] font-bold text-on-surface">Ice Cream</h1>
      </div>

      {/* Discount banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-3 mb-4 bg-discount-bg border border-price-green/20 rounded-xl p-3 flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-price-green/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined fill text-price-green text-[22px]">local_offer</span>
        </div>
        <div>
          <p className="text-[15px] font-bold text-price-green">{discount}% discount applied</p>
          <p className="text-[12px] text-on-surface-variant">From your Sing for Your Scoop score</p>
        </div>
      </motion.div>

      {/* Product grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {ICE_CREAM_PRODUCTS.map((product) => {
            const discountedPrice = Math.round(product.price * (1 - discount / 100));
            return (
              <ProductCard
                key={product.name}
                {...product}
                price={discountedPrice}
                originalPrice={product.price}
                discount={`${discount}% OFF`}
                quantity={getQuantity(product.name)}
                onAdd={() => onAddToCart(product)}
                onRemove={() => onRemoveFromCart(product.name)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
