import React from "react";
import Link from "next/link";
import clsx from "clsx";

type BadgeLinkProps = {
  href: string;
  label: string;
  text: string;
  className?: string;
};

export function BadgeLink({ href, label, text, className }: BadgeLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
    >
      <div className="w-max cursor-pointer items-center transition duration-100 ease-linear ring-1 ring-inset py-1 pr-2 pl-1 text-sm font-medium bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200 hover:bg-utility-brand-100 hidden md:flex">
        <span className="inline-flex items-center ring-1 ring-inset px-2.5 py-0.5 mr-2 bg-primary text-current ring-utility-brand-200">
          {label}
        </span>
        {text}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ml-1 size-4 text-utility-brand-500"
        >
          <path d="M5 12h14m0 0-7-7m7 7-7 7"></path>
        </svg>
      </div>

      <div className="inline-flex w-max cursor-pointer items-center transition duration-100 ease-linear ring-1 ring-inset py-1 pr-2 pl-1 text-xs font-medium bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200 hover:bg-utility-brand-100 md:hidden">
        <span className="inline-flex items-center ring-1 ring-inset px-2 py-0.5 mr-2 bg-primary text-current ring-utility-brand-200">
          {label}
        </span>
        {text}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ml-1 size-4 text-utility-brand-500"
        >
          <path d="M5 12h14m0 0-7-7m7 7-7 7"></path>
        </svg>
      </div>
    </Link>
  );
}
