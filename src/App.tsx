import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "./components/AppShell";
import { EntryScreen } from "./screens/EntryScreen";
import { SingScreen } from "./screens/SingScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { CartScreen } from "./screens/CartScreen";
import { OrderConfirmScreen } from "./screens/OrderConfirmScreen";
import { getDiscountTier } from "./lib/discounts";
import type { CartItem, Product } from "./lib/products";

type Screen = "entry" | "sing" | "result" | "shop" | "cart" | "order-confirm";

const pageTransition = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [prevScreen, setPrevScreen] = useState<Screen>("entry");
  const [score, setScore] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  const discount = score > 0 ? getDiscountTier(score).discount : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateTo = useCallback((next: Screen) => {
    setPrevScreen(screen);
    setScreen(next);
  }, [screen]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.name === product.name);
      if (existing) {
        return prev.map(item =>
          item.product.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productName: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.name === productName);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter(item => item.product.name !== productName);
      }
      return prev.map(item =>
        item.product.name === productName
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }, []);

  const updateQuantity = useCallback((productName: string, delta: number) => {
    if (delta > 0) {
      const item = cart.find(i => i.product.name === productName);
      if (item) addToCart(item.product);
    } else {
      removeFromCart(productName);
    }
  }, [cart, addToCart, removeFromCart]);

  const getQuantity = useCallback((productName: string) => {
    return cart.find(item => item.product.name === productName)?.quantity ?? 0;
  }, [cart]);

  const handleCheckout = useCallback(() => {
    navigateTo("order-confirm");
  }, [navigateTo]);

  const handleBackToHome = useCallback(() => {
    setCart([]);
    setScore(0);
    setScreen("entry");
  }, []);

  const cartTotal = (() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = Math.round(subtotal * (discount / 100));
    const deliveryFee = subtotal > 0 ? 25 : 0;
    return subtotal - discountAmount + deliveryFee;
  })();

  return (
    <AppShell
      cartCount={cartCount}
      onCartClick={() => navigateTo("cart")}
      onHomeClick={() => navigateTo("entry")}
    >
      <AnimatePresence mode="wait">
        {screen === "entry" && (
          <motion.div key="entry" {...pageTransition} className="h-full">
            <EntryScreen
              onSing={() => navigateTo("sing")}
              getQuantity={getQuantity}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          </motion.div>
        )}

        {screen === "sing" && (
          <motion.div key="sing" {...pageTransition} className="h-full">
            <SingScreen
              onComplete={(s) => {
                setScore(s);
                navigateTo("result");
              }}
              onBack={() => navigateTo("entry")}
            />
          </motion.div>
        )}

        {screen === "result" && (
          <motion.div key="result" {...pageTransition} className="h-full">
            <ResultScreen
              score={score}
              onTryAgain={() => navigateTo("sing")}
              onApply={() => navigateTo("shop")}
              getQuantity={getQuantity}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          </motion.div>
        )}

        {screen === "shop" && (
          <motion.div key="shop" {...pageTransition} className="h-full">
            <ShopScreen
              discount={discount}
              onBack={() => navigateTo("entry")}
              getQuantity={getQuantity}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
            />
          </motion.div>
        )}

        {screen === "cart" && (
          <motion.div key="cart" {...pageTransition} className="h-full">
            <CartScreen
              cart={cart}
              discount={discount}
              onUpdateQuantity={updateQuantity}
              onCheckout={handleCheckout}
              onBack={() => setScreen(prevScreen)}
            />
          </motion.div>
        )}

        {screen === "order-confirm" && (
          <motion.div key="order-confirm" {...pageTransition} className="h-full">
            <OrderConfirmScreen
              total={cartTotal}
              itemCount={cartCount}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
