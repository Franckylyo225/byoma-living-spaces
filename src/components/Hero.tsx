import { Button } from "@/components/ui/button";
import { ChevronDown, CalendarIcon, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [heroSlide1, heroSlide2, heroSlide3];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ checkIn, checkOut, guests });
  };

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
            className="animate-hidden animate-fade-in-up delay-400 bg-background/95 backdrop-blur-md p-6 md:p-8 rounded-sm shadow-2xl max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Check-in Date */}
              <div className="text-left">
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Arrivée
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gold/20 hover:border-gold/40",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                      {checkIn ? format(checkIn, "dd MMM yyyy", { locale: fr }) : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="text-left">
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Départ
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gold/20 hover:border-gold/40",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                      {checkOut ? format(checkOut, "dd MMM yyyy", { locale: fr }) : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="text-left">
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Voyageurs
                </label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="border-gold/20 hover:border-gold/40">
                    <Users className="mr-2 h-4 w-4 text-gold" />
                    <SelectValue placeholder="Nombre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 personne</SelectItem>
                    <SelectItem value="2">2 personnes</SelectItem>
                    <SelectItem value="3">3 personnes</SelectItem>
                    <SelectItem value="4">4 personnes</SelectItem>
                    <SelectItem value="5">5+ personnes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="gold" size="lg" className="w-full">
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
