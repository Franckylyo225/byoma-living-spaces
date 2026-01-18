import { Button } from "@/components/ui/button";
import { ChevronDown, CalendarIcon, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [heroSlide1, heroSlide2, heroSlide3];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ dateRange, adults, children });
  };

  const incrementAdults = () => setAdults((prev) => prev + 1);
  const decrementAdults = () => setAdults((prev) => Math.max(0, prev - 1));
  const incrementChildren = () => setChildren((prev) => prev + 1);
  const decrementChildren = () => setChildren((prev) => Math.max(0, prev - 1));

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide}
            alt={`BYOMA Résidence ${index + 1}`}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            style={{
              animationDelay: `${index * 5}s`,
            }}
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="animate-hidden animate-fade-in-up text-primary-foreground/80 tracking-luxury uppercase text-sm md:text-base mb-6">
            Résidences Hôtelières d'Exception
          </p>

          {/* Main Headline */}
          <h1 className="animate-hidden animate-fade-in-up delay-200 font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-medium leading-tight mb-8">
            L'Art de
            <br />
            <span className="italic">Séjourner</span>
          </h1>

          {/* Description */}
          <p className="animate-hidden animate-fade-in-up delay-300 text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Découvrez une nouvelle vision de l'hospitalité où élégance, 
            confort et innovation se rencontrent pour créer des expériences inoubliables.
          </p>

          {/* Reservation Form */}
          <form 
            onSubmit={handleSubmit}
            className="animate-hidden animate-fade-in-up delay-400 bg-white backdrop-blur-md rounded-sm shadow-2xl max-w-4xl mx-auto overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Check-in / Check-out Combined */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-border/30">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className={cn(
                        "text-sm",
                        !dateRange?.from && "text-muted-foreground"
                      )}>
                        {dateRange?.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, "dd MMM", { locale: fr })} - ${format(dateRange.to, "dd MMM", { locale: fr })}`
                          ) : (
                            format(dateRange.from, "dd MMM yyyy", { locale: fr })
                          )
                        ) : (
                          "Check in / Check out"
                        )}
                      </span>
                      <CalendarIcon className="h-5 w-5 text-gold" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={(date) => date < new Date()}
                      numberOfMonths={2}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Adults Counter */}
              <div className="flex items-center justify-between px-6 py-4 border-b md:border-b-0 md:border-r border-border/30 min-w-[160px]">
                <span className="text-sm text-muted-foreground">Adultes</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-4 text-center">{adults}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={decrementAdults}
                      className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-30"
                      disabled={adults === 0}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={incrementAdults}
                      className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Children Counter */}
              <div className="flex items-center justify-between px-6 py-4 border-b md:border-b-0 md:border-r border-border/30 min-w-[160px]">
                <span className="text-sm text-muted-foreground">Enfants</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-4 text-center">{children}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={decrementChildren}
                      className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-30"
                      disabled={children === 0}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={incrementChildren}
                      className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="gold" 
                className="m-3 md:m-2 px-8 h-auto py-4 md:py-0 rounded-sm"
              >
                Rechercher
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? "bg-primary-foreground w-8" 
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hidden animate-fade-in delay-600">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Découvrir</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
