import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const stats = [
  { label: "Years of Experience", value: "3+" },
  { label: "Projects Completed", value: "35+" },
  { label: "Technologies Mastered", value: "20+" }
];

export const StatsCarousel = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-2xl md:text-3xl font-light text-foreground/90 mb-12">
          Always Learning, always growing
        </h2>
        
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {stats.map((stat, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/3">
                <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-foreground/60 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-accent">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
