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
        className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
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
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
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
  "group inline-flex h-9 w-max items-center justify-center rounded-lg bg-background px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:data-[state=open]:bg-gray-800/50"
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
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "relative top-[1px] ml-1 h-3.5 w-3.5 transition duration-200 group-hover:translate-y-[1px]",
          isOpen && "rotate-180"
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
          "absolute left-0 top-full z-40 mt-2 w-auto min-w-[280px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-gray-100 shadow-xl transition-all",
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
        "block select-none rounded-lg p-2.5 text-xs font-medium leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 focus:bg-gray-100 dark:focus:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function NavigationMenuIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  );
}
