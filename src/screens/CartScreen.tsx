import { motion } from "framer-motion";
import type { CartItem } from "../lib/products";

interface CartScreenProps {
  cart: CartItem[];
  discount: number;
  onUpdateQuantity: (productName: string, delta: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export function CartScreen({ cart, discount, onUpdateQuantity, onCheckout, onBack }: CartScreenProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h1 className="font-heading text-[20px] font-bold text-on-surface">Your Cart</h1>
        <span className="text-[14px] text-on-surface-variant ml-auto">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant">shopping_cart</span>
          </div>
          <p className="text-[16px] font-semibold text-on-surface text-center">Your cart is empty</p>
          <p className="text-[13px] text-on-surface-variant text-center">
            Add some ice cream to get started
          </p>
        </div>
      ) : (
        <>
          {/* Discount banner */}
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mt-3 bg-discount-bg border border-price-green/20 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-price-green/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined fill text-price-green text-[18px]">local_offer</span>
              </div>
              <p className="text-[13px] font-bold text-price-green">{discount}% singing discount applied</p>
            </motion.div>
          )}

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2">
            <div className="flex flex-col gap-3">
              {cart.map((item, i) => {
                const discountedPrice = discount > 0
                  ? Math.round(item.product.price * (1 - discount / 100))
                  : item.product.price;
                return (
                  <motion.div
                    key={item.product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 bg-surface border border-outline-variant rounded-xl p-3"
                  >
                    {/* Product image */}
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.product.imageColor + "15" }}
                    >
                      <span
                        className="material-symbols-outlined fill text-[32px]"
                        style={{ color: item.product.imageColor }}
                      >
                        icecream
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-on-surface leading-tight truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {item.product.brand} &middot; {item.product.weight}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[15px] font-extrabold text-on-surface">
                          Rs {discountedPrice}
                        </span>
                        {discount > 0 && (
                          <span className="text-[11px] text-on-surface-variant line-through">
                            Rs {item.product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 shrink-0 self-end">
                      <button
                        onClick={() => onUpdateQuantity(item.product.name, -1)}
                        className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {item.quantity === 1 ? "delete" : "remove"}
                        </span>
                      </button>
                      <span className="w-7 text-center text-[15px] font-bold text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.name, 1)}
                        className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Order summary + checkout */}
          <div className="border-t border-outline-variant bg-surface px-4 pt-3 pb-4">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface font-semibold">Rs {subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-price-green font-semibold">Singing discount ({discount}%)</span>
                  <span className="text-price-green font-semibold">- Rs {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-on-surface-variant">Delivery fee</span>
                <span className="text-on-surface font-semibold">Rs {deliveryFee}</span>
              </div>
              <div className="border-t border-outline-variant pt-2 flex justify-between">
                <span className="text-[16px] font-bold text-on-surface">Total</span>
                <span className="text-[16px] font-extrabold text-on-surface">Rs {total}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-primary text-on-primary font-bold text-[15px] py-3.5 rounded-full active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Place Order &middot; Rs {total}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
