import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Wine, Clock } from "lucide-react";
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";

const slides = [restaurant1, restaurant2, restaurant3, restaurant4];

const RestaurantSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
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
            <div className="relative overflow-hidden rounded-lg h-[500px] md:h-[600px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: currentSlide === index ? 1 : 0 }}
                >
                  <img
                    src={slide}
                    alt={`Restaurant BYOMA ${index + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                      currentSlide === index ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "bg-accent w-6" : "bg-background/60"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-8 bg-accent text-accent-foreground p-6 md:p-8 rounded-lg shadow-elegant z-10">
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
