'use client'

import { useState, useEffect, useCallback } from 'react'
import type { NewsItem } from '@/types/payload'

interface FeaturedSectionProps {
  sliderNews: NewsItem[]
  sideNews: NewsItem[]
}

export default function FeaturedSection({ sliderNews, sideNews }: FeaturedSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % sliderNews.length)
  }, [sliderNews.length])

  useEffect(() => {
    if (isPaused || sliderNews.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide, sliderNews.length])

  if (sliderNews.length === 0) return null

  const sideLarge = sideNews[0]
  const sideSmall = sideNews.slice(1, 3)

  return (
    <section className="bg-[#f2f2f2]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* flex-row com stretch: slider e side blocks ficam com mesma altura */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">

          {/* Slider - 2/3, altura definida pelo lado direito */}
          <div
            className="relative lg:w-2/3 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* No mobile usa aspect ratio, no desktop preenche 100% da altura */}
            <div className="relative aspect-[702/336] lg:aspect-auto lg:h-full">
              {sliderNews.map((item, index) => (
                <a
                  key={item.id}
                  href={item.link}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="size-full object-cover"
                  />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-semibold px-3 py-1 uppercase">
                    {item.category}
                  </span>
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                    <time className="text-white/70 text-sm">{item.date}</time>
                    <h3 className="text-white text-lg font-semibold mt-1 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </a>
              ))}

              {/* Dots — dentro do slider, sobre a imagem */}
              {sliderNews.length > 1 && (
                <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
                  {sliderNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`size-2.5 rounded-full transition ${
                        index === currentSlide ? 'bg-brand-600' : 'bg-white/60'
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side blocks - 1/3, define a altura total */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            {/* Large side article */}
            {sideLarge && (
              <a href={sideLarge.link} className="group relative block overflow-hidden">
                <img
                  src={sideLarge.imageUrl}
                  alt={sideLarge.imageAlt}
                  className="w-full aspect-[351/185] object-cover transition group-hover:opacity-80"
                />
                <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-semibold px-2 py-0.5 uppercase">
                  {sideLarge.category}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-3">
                  {sideLarge.title}
                </h3>
              </a>
            )}

            {/* Small side articles */}
            {sideSmall.map((item) => (
              <a key={item.id} href={item.link} className="group flex gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  className="w-[120px] h-[90px] object-cover shrink-0 transition group-hover:opacity-80"
                />
                <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-3">
                  {item.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
