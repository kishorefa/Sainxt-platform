"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AICarousel({ items, className }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    inViewThreshold: 0.7,
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Auto-advance the carousel
  React.useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext()
      }
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                {/* Background Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
        onClick={scrollNext}
      >
        <ArrowRight className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
