"use client";

import { useState, useEffect } from "react";

interface FeaturedItem {
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  description: string;
  date: string;
  link: string;
}

interface FeaturedPostProps {
  items: FeaturedItem[];
  autoPlayInterval?: number;
}

export default function FeaturedPost({
  items,
  autoPlayInterval = 5000,
}: FeaturedPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  const currentItem = items[currentIndex];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Desktop Version */}
      <div className="relative hidden w-full overflow-hidden md:block md:h-145 lg:h-180">
        <a
          href={currentItem.link}
          className="absolute inset-0 outline-focus-ring select-none focus:outline-2 focus:outline-offset-4"
        >
          <img
            src={currentItem.imageUrl}
            alt={currentItem.imageAlt}
            className="size-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-black/40 to-transparent pt-24">
            <div className="flex w-full flex-col gap-6 p-8">
              <div className="flex flex-col gap-2">
                <p className="text-display-xs font-semibold text-white">
                  {currentItem.title}
                </p>
                <p className="line-clamp-2 text-md text-white">
                  {currentItem.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                  {currentItem.category}
                </span>
                <span className="text-sm text-white">{currentItem.date}</span>
              </div>
            </div>
          </div>
        </a>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          <a href={currentItem.link} className="overflow-hidden" tabIndex={-1}>
            <img
              src={currentItem.imageUrl}
              alt={currentItem.imageAlt}
              className="aspect-[1.5] w-full object-cover transition duration-500"
            />
          </a>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                  {currentItem.category}
                </span>
                <span className="text-sm text-tertiary">{currentItem.date}</span>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href={currentItem.link}
                  className="text-lg font-semibold text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {currentItem.title}
                </a>
                <p className="line-clamp-2 text-md text-tertiary">
                  {currentItem.description}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Carousel Indicators */}
          <div className="flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-brand-solid"
                    : "w-2 bg-utility-gray-300 hover:bg-utility-gray-400"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
