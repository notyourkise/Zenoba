"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationMenuContext = React.createContext<{
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}>({
  activeItem: null,
  setActiveItem: () => {},
});

export function NavigationMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
      <nav
        className={cn("relative z-10 flex items-center justify-center", className)}
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
      className={cn("flex list-none items-center justify-center gap-1.5", className)}
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)} {...props} />;
}

export const navigationMenuTriggerStyle = cva(
  "inline-flex h-9 items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
);

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext);
  const id = React.useId();
  const isOpen = activeItem === id;

  return (
    <button
      type="button"
      onClick={() => setActiveItem(isOpen ? null : id)}
      className={cn(
        navigationMenuTriggerStyle(),
        isOpen && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      <span className="flex items-center gap-1.5">{children}</span>
      <ChevronDown
        className={cn(
          "ml-1 h-3.5 w-3.5 transition-transform duration-200",
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
  const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext);

  if (!activeItem) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={() => setActiveItem(null)}
      />
      <div
        className={cn(
          "absolute left-0 top-full z-40 mt-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl transition-all",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
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
        "block select-none rounded-lg p-2.5 text-xs font-medium no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
