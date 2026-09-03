"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      "aria-expanded"?: boolean;
      "aria-haspopup"?: boolean;
      className?: string;
    }>;
    return React.cloneElement(childElement, {
      onClick: (e: React.MouseEvent) => {
        childElement.props.onClick?.(e);
        setOpen((prev) => !prev);
      },
      "aria-expanded": open,
      "aria-haspopup": true,
      className: cn(childElement.props.className, className),
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      aria-haspopup="true"
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = "end",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" | "center" }) {
  const { open } = useDropdownMenu();

  if (!open) return null;

  const alignmentClass =
    align === "end"
      ? "right-0 origin-top-right"
      : align === "start"
      ? "left-0 origin-top-left"
      : "left-1/2 -translate-x-1/2 origin-top";

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className={cn(
        "absolute z-50 mt-2 min-w-[14rem] rounded-xl border border-gray-200 bg-white/95 p-1.5 text-gray-900 shadow-2xl backdrop-blur-md dark:border-white/15 dark:bg-[#0b0e19]/95 dark:text-white",
        alignmentClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1.5 my-1 h-px bg-gray-100 dark:bg-white/10", className)}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  asChild,
  children,
  onSelect,
  onClick,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    onSelect?.();
    setOpen(false);
  };

  const itemClasses = cn(
    "relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors",
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
    "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-white/10 dark:focus:text-white",
    disabled && "pointer-events-none opacity-45 cursor-not-allowed",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      className?: string;
      role?: string;
    }>;
    return React.cloneElement(childElement, {
      role: "menuitem",
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        childElement.props.onClick?.(e);
        handleClick(e);
      },
      className: cn(itemClasses, childElement.props.className),
    });
  }

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent<HTMLElement>);
        }
      }}
      className={itemClasses}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto pl-4 text-xs font-mono tracking-wider text-gray-400 dark:text-slate-500",
        className
      )}
      {...props}
    />
  );
}
