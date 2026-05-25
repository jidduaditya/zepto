interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-dim p-4">
      {/* Phone frame */}
      <div className="w-[390px] h-[844px] bg-surface rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Status bar mock */}
        <div className="h-[54px] flex items-end justify-between px-8 pb-1">
          <span className="text-[14px] font-semibold text-on-surface">
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-sm border border-on-surface relative">
              <div className="absolute inset-[1.5px] right-[3px] bg-on-surface rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Bottom nav - Stitch style */}
        <div className="h-16 border-t border-outline-variant shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex justify-around items-center px-2 bg-surface-white">
          <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1">
            <span className="material-symbols-outlined fill text-[22px]">home</span>
            <span className="font-[Inter] text-[10px] font-bold tracking-wider mt-0.5">HOME</span>
          </button>
          <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 px-4 py-1">
            <span className="material-symbols-outlined text-[22px]">grid_view</span>
            <span className="font-[Inter] text-[10px] font-bold tracking-wider mt-0.5">CATEGORIES</span>
          </button>
          <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 px-4 py-1">
            <span className="material-symbols-outlined text-[22px]">search</span>
            <span className="font-[Inter] text-[10px] font-bold tracking-wider mt-0.5">SEARCH</span>
          </button>
          <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 px-4 py-1 relative">
            <span className="absolute top-0 right-2 w-2 h-2 bg-secondary rounded-full" />
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            <span className="font-[Inter] text-[10px] font-bold tracking-wider mt-0.5">CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}
