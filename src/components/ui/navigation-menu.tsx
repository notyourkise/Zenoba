"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationMenuContextType {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextType>({
  activeItem: null,
  setActiveItem: () => {},
});

const NavigationMenuItemContext = React.createContext<{
  itemId: string;
  isOpen: boolean;
}>({
  itemId: "",
  isOpen: false,
});

export function NavigationMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSetActiveItem = React.useCallback((id: string | null) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveItem(id);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveItem(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem }}>
      <nav
        ref={navRef}
        className={cn("relative z-30 flex items-center justify-center", className)}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("flex list-none items-center justify-center gap-4 sm:gap-6", className)}
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  const itemId = React.useId();
  const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext);
  const isOpen = activeItem === itemId;
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveItem(itemId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 150);
  };

  return (
    <NavigationMenuItemContext.Provider value={{ itemId, isOpen }}>
      <li
        className={cn("relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

export const navigationMenuTriggerStyle = cva(
  "inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none cursor-pointer"
);

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setActiveItem } = React.useContext(NavigationMenuContext);
  const { itemId, isOpen } = React.useContext(NavigationMenuItemContext);

  return (
    <button
      type="button"
      onClick={() => setActiveItem(isOpen ? null : itemId)}
      className={cn(
        navigationMenuTriggerStyle(),
        isOpen && "text-blue-600 dark:text-blue-400 font-semibold",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "ml-1.5 h-3.5 w-3.5 transition-transform duration-200 text-gray-400",
          isOpen && "rotate-180 text-blue-600 dark:text-blue-400"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export function NavigationMenuContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = React.useContext(NavigationMenuItemContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 min-w-[340px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-3 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NavigationMenuLink({
  className,
  children,
  render,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  render?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
}) {
  if (render) {
    return React.cloneElement(render, {
      className: cn(render.props.className, className),
      children: render.props.children || children,
    });
  }

  return (
    <a
      className={cn(
        "block select-none rounded-lg p-2.5 text-sm font-medium no-underline outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
