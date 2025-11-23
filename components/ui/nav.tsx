import React from "react";

interface NavButtonProps {
  label: string;
  href: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export const NavButton: React.FC<NavButtonProps> = ({
  label,
  href,
  onClick,
  variant = "primary",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap px-4.5 py-3 text-md font-semibold shadow-xs transition duration-100 ease-linear";
  const variants: Record<typeof variant, string> = {
    primary: "bg-brand-solid text-white hover:bg-brand-solid_hover ring-1 ring-transparent ring-inset",
    secondary: "bg-primary text-secondary hover:bg-primary_hover hover:text-secondary_hover ring-1 ring-primary ring-inset",
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {label}
    </a>
  );
};
