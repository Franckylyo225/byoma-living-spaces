import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroResidence from "@/assets/hero-residence.jpg";

const testimonials = [
  {
    id: 1,
    name: "Marie-Claire Dubois",
    location: "Paris, France",
    text: "Du check-in au check-out, l'expérience était fluide et luxueuse. Je recommande vivement.",
  },
  {
    id: 2,
    name: "Jean-Philippe Laurent",
    location: "Genève, Suisse",
    text: "L'excellence à l'état pur. Du service personnalisé à la qualité des équipements, tout était parfait.",
  },
  {
    id: 3,
    name: "Aminata Koné",
    location: "Abidjan, Côte d'Ivoire",
    text: "BYOMA incarne parfaitement l'alliance entre modernité et tradition africaine. Un cocon de sérénité.",
  },
  {
    id: 4,
    name: "Thomas Bergmann",
    location: "Munich, Allemagne",
    text: "Impressionné par la qualité des résidences et le professionnalisme de l'équipe. Hautement recommandé.",
  }
];

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="relative h-[500px] md:h-[450px] overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroResidence})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-charcoal/70" />
      
      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex items-center">
        <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          
          {/* Left: Rating */}
          <div className="text-center md:text-left">
            <p className="font-display text-7xl md:text-8xl lg:text-9xl text-white font-bold leading-none mb-4">
              4.9
            </p>
            <div className="flex gap-1 justify-center md:justify-start mb-2">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={20} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              (300+ Avis)
            </p>
          </div>
          
          {/* Right: Testimonial */}
          <div className="text-center md:text-left">
            {/* Stars */}
            <div className="flex gap-1 justify-center md:justify-start mb-6">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-white font-medium leading-tight mb-6 italic">
              {currentTestimonial.text}
            </blockquote>
            
            {/* Author */}
            <p className="text-white/80 text-sm">
              {currentTestimonial.name}, {currentTestimonial.location}
            </p>
            
            {/* Pagination dots */}
            <div className="flex gap-2 mt-8 justify-center md:justify-start">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-white w-6" 
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Voir témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
