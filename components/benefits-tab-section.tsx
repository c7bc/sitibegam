"use client";

import { useState } from "react";

export interface Benefit {
  id: string;
  name: string;
  discount: string;
  address?: string;
  phone?: string;
  hours?: string;
  observations?: string;
  icon?: React.ReactNode;
}

export interface BenefitCategory {
  id: string;
  name: string;
  benefits: Benefit[];
}

interface BenefitsTabSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  categories: BenefitCategory[];
}

export default function BenefitsTabSection({
  title = "Benefícios e Convênios",
  subtitle = "Vantagens exclusivas para sindicalizados",
  badge,
  categories,
}: BenefitsTabSectionProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          {badge && (
            <span className="mb-3 inline-flex items-center bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
              {badge}
            </span>
          )}
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-3xl text-lg text-tertiary md:mt-5 md:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile Dropdown */}
        <div className="mb-8 md:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full border border-primary bg-primary px-4 py-3 text-md text-secondary shadow-xs transition focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="mb-8 hidden border-b border-secondary md:mb-12 md:block">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`whitespace-nowrap border-b-2 px-1 pb-4 text-md font-semibold transition ${
                  activeTab === category.id
                    ? "border-fg-brand-primary_alt text-brand-secondary"
                    : "border-transparent text-quaternary hover:border-tertiary hover:text-secondary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Benefits Grid */}
        {activeCategory && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCategory.benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex flex-col border border-secondary bg-primary p-6 shadow-xs transition hover:shadow-sm"
              >
                {/* Icon */}
                {benefit.icon && (
                  <div className="mb-4 inline-flex size-12 items-center justify-center bg-brand-secondary text-white">
                    {benefit.icon}
                  </div>
                )}

                {/* Name */}
                <h3 className="text-lg font-semibold text-primary">
                  {benefit.name}
                </h3>

                {/* Discount - Highlighted */}
                <div className="mt-3 inline-flex items-center bg-utility-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                  {benefit.discount}
                </div>

                {/* Details */}
                <div className="mt-4 space-y-3 text-sm text-tertiary">
                  {benefit.address && (
                    <div>
                      <p className="font-medium text-secondary">Endereço:</p>
                      <p>{benefit.address}</p>
                    </div>
                  )}

                  {benefit.phone && (
                    <div>
                      <p className="font-medium text-secondary">Contato:</p>
                      <p>{benefit.phone}</p>
                    </div>
                  )}

                  {benefit.hours && (
                    <div>
                      <p className="font-medium text-secondary">Horário:</p>
                      <p>{benefit.hours}</p>
                    </div>
                  )}

                  {benefit.observations && (
                    <div>
                      <p className="font-medium text-secondary">Observações:</p>
                      <p className="text-xs">{benefit.observations}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {activeCategory && activeCategory.benefits.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-tertiary">
              Nenhum convênio disponível nesta categoria no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
