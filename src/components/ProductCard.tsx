interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  weight: string;
  imageColor: string;
}

export function ProductCard({
  name,
  brand,
  price,
  weight,
  imageColor,
}: ProductCardProps) {
  return (
    <div className="bg-zepto-bg rounded-[12px] border border-zepto-border p-3 flex flex-col gap-2">
      <div
        className="w-full aspect-square rounded-lg flex items-center justify-center text-3xl"
        style={{ backgroundColor: imageColor }}
      >
        🍦
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] text-zepto-text-secondary uppercase tracking-wide">
          {brand}
        </p>
        <p className="text-[13px] font-semibold text-zepto-text leading-tight">
          {name}
        </p>
        <p className="text-[11px] text-zepto-text-secondary">{weight}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[15px] font-bold text-zepto-text">
          Rs {price}
        </span>
        <button className="bg-zepto-purple-light text-zepto-purple text-[12px] font-bold px-3 py-1.5 rounded-lg active:bg-purple-200">
          ADD
        </button>
      </div>
    </div>
  );
}
