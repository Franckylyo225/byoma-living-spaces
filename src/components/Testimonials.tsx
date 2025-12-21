import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Marie-Claire Dubois",
    location: "Paris, France",
    rating: 5,
    text: "Un séjour absolument exceptionnel. Le raffinement des espaces et l'attention portée aux moindres détails font de BYOMA une adresse incontournable. Je recommande vivement.",
    date: "Novembre 2024"
  },
  {
    id: 2,
    name: "Jean-Philippe Laurent",
    location: "Genève, Suisse",
    rating: 5,
    text: "L'excellence à l'état pur. Du service personnalisé à la qualité des équipements, tout était parfait. Une expérience hôtelière qui redéfinit le luxe accessible.",
    date: "Octobre 2024"
  },
  {
    id: 3,
    name: "Aminata Koné",
    location: "Abidjan, Côte d'Ivoire",
    rating: 5,
    text: "BYOMA incarne parfaitement l'alliance entre modernité et tradition africaine. Un cocon de sérénité où chaque moment devient un souvenir précieux.",
    date: "Septembre 2024"
  },
  {
    id: 4,
    name: "Thomas Bergmann",
    location: "Munich, Allemagne",
    rating: 4,
    text: "Impressionné par la qualité des résidences et le professionnalisme de l'équipe. Un lieu idéal pour les voyageurs exigeants en quête d'authenticité.",
    date: "Août 2024"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={18}
          className={index < rating ? "fill-gold text-gold" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 md:py-32 bg-cream relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className={`text-center mb-16 md:mb-20 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <span className="inline-block text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            Ce que disent nos hôtes
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-charcoal-light max-w-2xl mx-auto text-lg">
            Découvrez les expériences authentiques de ceux qui ont choisi BYOMA 
            pour leurs séjours d'exception.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-background p-8 md:p-10 rounded-sm border border-gold/10 hover:border-gold/30 transition-all duration-500 group relative ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 text-6xl font-display text-gold/10 leading-none">
                "
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <StarRating rating={testimonial.rating} />
              </div>
              
              {/* Testimonial text */}
              <blockquote className="text-charcoal-light text-lg leading-relaxed mb-8 relative z-10">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author info */}
              <div className="flex items-center justify-between border-t border-gold/10 pt-6">
                <div>
                  <p className="font-display text-xl text-charcoal group-hover:text-gold transition-colors duration-300">
                    {testimonial.name}
                  </p>
                  <p className="text-charcoal-light text-sm">
                    {testimonial.location}
                  </p>
                </div>
                <span className="text-gold/60 text-sm font-medium">
                  {testimonial.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Summary */}
        <div className={`mt-16 md:mt-20 text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "600ms" }}>
          <div className="inline-flex flex-col items-center bg-charcoal/5 px-12 py-8 rounded-sm">
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={24} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="font-display text-3xl text-charcoal mb-1">4.9/5</p>
            <p className="text-charcoal-light text-sm">
              Basé sur plus de 200 avis vérifiés
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
