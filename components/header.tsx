/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React, { useState } from "react";
import { NavButton } from "@/components/ui/nav";
import type { NavItem } from "@/types/payload";

interface HeaderProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "INÍCIO", href: "/" },
  { label: "SINDICATO", href: "/sindicato" },
  { label: "JURÍDICO", href: "/juridico" },
  { label: "PUBLICAÇÕES", href: "/publicacoes" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTATO", href: "/contato" },
];

export default function Header({ navItems = defaultNavItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Separate regular links from button items
  const linkItems = navItems.filter(item => !item.isButton);
  const buttonItems = navItems.filter(item => item.isButton);

  return (
    <header>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a className="text-brand-500 flex items-center gap-2 mt-4" href="/">
<img src="/image.png" alt="SITIBEGAM Logo" width="60" height="60" />
              <div className="flex flex-col text-sm font-semibold text-brand-500">
                <span>SITIBEGAM</span>
                <span>BELÉM</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Centralizado */}
          <nav
            aria-label="Global"
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2"
          >
            <ul className="flex items-center gap-8 text-sm">
              {linkItems.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <a
                    className="text-primary transition hover:text-brand-600 font-medium"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botões de ação e menu mobile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex sm:gap-4">
              {buttonItems.map((item, index) => (
                <NavButton key={`btn-${item.href}-${index}`} label={item.label} href={item.href} />
              ))}
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="lg:hidden rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav aria-label="Mobile">
              <ul className="flex flex-col space-y-3">
                {linkItems.map((item, index) => (
                  <li key={`mobile-${item.href}-${index}`}>
                    <a
                      className="block text-primary transition hover:text-brand-600 font-medium py-2"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                {buttonItems.map((item, index) => (
                  <li key={`mobile-btn-${item.href}-${index}`} className="pt-2 sm:hidden">
                    <NavButton label={item.label} href={item.href} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
