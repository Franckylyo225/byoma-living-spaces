import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Wine, Clock } from "lucide-react";
import restaurantImage from "@/assets/restaurant-ambiance.jpg";

const RestaurantSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: UtensilsCrossed,
      title: "Cuisine Gastronomique",
      description: "Saveurs africaines et internationales revisitées",
    },
    {
      icon: Wine,
      title: "Cave à Vins",
      description: "Sélection de grands crus soigneusement choisis",
    },
    {
      icon: Clock,
      title: "Service Continu",
      description: "Petit-déjeuner, déjeuner et dîner",
    },
  ];

  return (
    <section
      id="restaurant-section"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className={`relative ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={restaurantImage}
                alt="Restaurant BYOMA Signature"
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-8 bg-accent text-accent-foreground p-6 md:p-8 rounded-lg shadow-elegant">
              <p className="font-display text-3xl md:text-4xl">BYOMA</p>
              <p className="text-sm tracking-luxury uppercase">Signature</p>
            </div>
          </div>

          {/* Content */}
          <div className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
            <p className="text-accent tracking-luxury uppercase text-sm mb-4">
              Gastronomie
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Restaurant BYOMA Signature
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Découvrez une expérience culinaire d'exception où les saveurs africaines 
              rencontrent la gastronomie internationale. Notre chef vous invite à un 
              voyage gustatif unique dans un cadre raffiné et chaleureux.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/restaurant">
              <Button variant="elegant" size="xl" className="group">
                Découvrir le restaurant
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
