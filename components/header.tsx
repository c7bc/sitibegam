'use client';

import React, { useState } from "react";
import Image from "next/image";
import type { NavItem, PayloadMedia } from "@/types/payload";
import { resolveMediaUrl } from "@/lib/resolve-media-url";

interface HeaderProps {
  navItems?: NavItem[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  latestNewsTitles?: Array<{ title: string; href: string }>;
  logo?: PayloadMedia | null;
  logoAlt?: string;
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

export default function Header({
  navItems = defaultNavItems,
  socialLinks,
  latestNewsTitles = [],
  logo,
  logoAlt,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = resolveMediaUrl(logo);

  // Renderiza todos os itens na nav (botões e links juntos, no estilo bancariospa)
  const linkItems = navItems;

  return (
    <header>
      {/* Top Bar */}
      <div className="border-t-4 border-brand-600 bg-[#f2f2f2] border-b border-[#e7e7e7]">
        <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center justify-between text-sm">
          {/* Ticker */}
          <div className="hidden md:flex items-center gap-8 overflow-hidden flex-1 min-w-0">
            <span className="text-brand-600 font-semibold uppercase shrink-0 tracking-wide">
              Últimas Notícias
            </span>
            {latestNewsTitles.length > 0 && (
              <div className="overflow-hidden relative flex-1">
                <div className="flex gap-10 animate-ticker">
                  {[...latestNewsTitles, ...latestNewsTitles].map((item, i) => (
                    <a
                      key={`${item.href}-${i}`}
                      href={item.href}
                      className="whitespace-nowrap text-[#656565] hover:text-brand-600 transition shrink-0"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social + Search */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} className="text-[#999] hover:text-brand-600 transition" aria-label="Instagram">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} className="text-[#999] hover:text-brand-600 transition" aria-label="Facebook">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} className="text-[#999] hover:text-brand-600 transition" aria-label="Twitter">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            )}

            {/* Search */}
            <form action="/publicacoes" method="get" className="hidden sm:flex items-center ml-2">
              <input
                type="text"
                name="q"
                placeholder="Busca..."
                className="h-6 bg-[#e9e9e9] border-0 px-2 text-[13px] text-[#999] outline-none w-32 focus:w-44 transition-all"
              />
              <button type="submit" className="bg-transparent -ml-6 text-[#bababa] hover:text-brand-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Logo Area */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center min-h-[100px]">
          <a href="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={logoAlt || "Logo SITIBEGAM"} className="h-20 w-auto" />
            ) : (
              <Image src="/image.png" alt="Logo SITIBEGAM" width={80} height={80} />
            )}
            <div className="flex flex-col font-semibold text-brand-800 text-lg leading-tight">
              <span>SITIBEGAM</span>
              <span>BELÉM - PA</span>
            </div>
          </a>
        </div>
      </div>

      {/* Nav Bar - Desktop */}
      <nav className="bg-brand-800 border-b-2 border-brand-600 relative z-50">
        <div className="mx-auto max-w-7xl px-6">
          {/* Desktop Menu */}
          <ul className="hidden lg:flex">
            {linkItems.map((item, index) => (
              <li key={`${item.href}-${index}`} className="group relative">
                <a
                  href={item.href}
                  className="block px-5 leading-[45px] text-[#efefef] uppercase text-sm font-medium tracking-wide border-b-2 border-transparent hover:border-brand-400 hover:bg-white/10 transition-all -mb-[2px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center justify-between py-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 text-[#efefef] py-2"
              aria-label="Toggle menu"
            >
              <span className="text-sm uppercase font-medium">Navegue</span>
              {mobileMenuOpen ? (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-800 border-t border-white/10">
            <div className="mx-auto max-w-7xl px-6 py-2">
              <ul className="flex flex-col">
                {linkItems.map((item, index) => (
                  <li key={`mobile-${item.href}-${index}`}>
                    <a
                      href={item.href}
                      className="block py-3 text-[#efefef] text-sm border-b border-white/10 hover:bg-white/10 px-2 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Mobile social */}
              <div className="flex items-center gap-4 py-4">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} className="text-white/60 hover:text-white" aria-label="Instagram">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} className="text-white/60 hover:text-white" aria-label="Facebook">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a href={socialLinks.twitter} className="text-white/60 hover:text-white" aria-label="Twitter">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
