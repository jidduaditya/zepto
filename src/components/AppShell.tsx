interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-200 p-4">
      {/* Phone frame */}
      <div className="w-[390px] h-[844px] bg-zepto-bg rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Status bar mock */}
        <div className="h-[54px] flex items-end justify-between px-8 pb-1">
          <span className="text-[14px] font-semibold text-zepto-text">
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-sm border border-zepto-text relative">
              <div className="absolute inset-[1.5px] right-[3px] bg-zepto-text rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Bottom nav mock */}
        <div className="h-[80px] border-t border-zepto-border flex items-center justify-around px-6 bg-zepto-bg">
          {["Home", "Categories", "Cart", "Account"].map((tab) => (
            <div key={tab} className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-zepto-border" />
              <span className="text-[10px] text-zepto-text-secondary">
                {tab}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
