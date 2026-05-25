interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  weight: string;
  imageColor: string;
  image?: string;
  discount?: string;
  badge?: string;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function ProductCard({
  name,
  brand,
  price,
  originalPrice,
  weight,
  imageColor,
  image,
  discount,
  badge,
  quantity = 0,
  onAdd,
  onRemove,
}: ProductCardProps) {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col relative">
      {/* Discount badge */}
      {discount && (
        <div className="absolute top-2 left-2 z-10 bg-discount-bg text-price-green px-2 py-0.5 rounded font-[Inter] text-[10px] font-bold leading-[12px] border border-price-green/20">
          {discount}
        </div>
      )}
      {/* Best value badge */}
      {badge && (
        <div className="absolute top-2 left-2 z-10 bg-secondary-fixed text-secondary px-2 py-0.5 rounded font-[Inter] text-[10px] font-bold leading-[12px]">
          {badge}
        </div>
      )}

      {/* Product image area */}
      <div
        className="aspect-square bg-surface-white flex items-center justify-center"
        style={{ backgroundColor: imageColor + "15" }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-3 mix-blend-multiply"
          />
        ) : (
          <span className="material-symbols-outlined fill text-[48px]" style={{ color: imageColor }}>
            icecream
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow gap-1.5">
        <p className="text-[11px] text-on-surface-variant uppercase tracking-wide font-[Inter] font-bold">
          {brand}
        </p>
        <p className="text-[13px] font-semibold text-on-surface leading-tight line-clamp-2">
          {name}
        </p>
        <p className="text-[11px] text-on-surface-variant">{weight}</p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-[18px] font-extrabold text-on-surface">
              Rs {price}
            </span>
            {originalPrice && (
              <span className="text-[11px] text-on-surface-variant line-through">
                Rs {originalPrice}
              </span>
            )}
          </div>
          {quantity > 0 ? (
            <div className="flex items-center gap-0.5">
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-full border border-secondary text-secondary flex items-center justify-center active:bg-secondary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="w-6 text-center text-[14px] font-bold text-on-surface">{quantity}</span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-full bg-secondary text-surface-white flex items-center justify-center active:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="bg-surface-white border border-secondary text-secondary rounded-full w-8 h-8 flex items-center justify-center active:bg-secondary active:text-surface-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
