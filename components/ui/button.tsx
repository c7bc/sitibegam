import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
  children: React.ReactNode;
};

export function Button({ variant = "solid", children, className, ...props }: ButtonProps) {
  const base =
    "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap px-5 py-3 text-md font-semibold transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants = {
    solid:
      "bg-brand-600 text-white shadow-xs-skeumorphic ring-1 ring-transparent hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
    outline:
      "bg-transparent text-brand-600 ring-1 ring-inset ring-brand-600 hover:bg-brand-50 disabled:text-gray-400 disabled:ring-gray-300 disabled:cursor-not-allowed",
  };

  return (
    <button {...props} className={clsx(base, variants[variant], className)}>
      {children}
    </button>
  );
}
