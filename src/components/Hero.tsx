import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-residence.jpg";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="BYOMA Résidence de luxe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

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

          {/* CTAs */}
          <div className="animate-hidden animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="heroSolid" size="xl">
              Découvrir nos résidences
            </Button>
            <Button variant="hero" size="xl">
              Réserver un séjour
            </Button>
          </div>
        </div>
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
