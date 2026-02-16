import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Theater, Music, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import spectacle1 from "@/assets/spectacle-1.jpg";
import spectacle2 from "@/assets/spectacle-2.jpg";
import spectacle3 from "@/assets/spectacle-3.jpg";

const slides = [spectacle1, spectacle2, spectacle3];

const SpectacleSection = () => {
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const eventTypes = [
    {
      icon: Theater,
      title: "Spectacles & Concerts",
      description: "Programmation artistique exclusive",
    },
    {
      icon: Users,
      title: "Événements Privés",
      description: "Mariages, galas et célébrations",
    },
    {
      icon: Calendar,
      title: "Conférences",
      description: "Séminaires et événements corporate",
    },
    {
      icon: Music,
      title: "Soirées Thématiques",
      description: "Ambiances uniques et mémorables",
    },
  ];

  return (
    <section
      id="spectacle-section"
      ref={sectionRef}
      className="relative py-24 md:py-32 text-background overflow-hidden"
    >
      {/* Background Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentSlide === index ? 1 : 0 }}
        >
          <img
            src={slide}
            alt=""
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
              currentSlide === index ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-foreground/75" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <p className="text-accent tracking-luxury uppercase text-sm mb-4">
            Événements & Spectacles
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Salle de Spectacle BYOMA
          </h2>
          <p className="text-background/70 text-lg leading-relaxed">
            Un espace modulable et prestigieux pour vos événements les plus exceptionnels. 
            De l'intimité d'un cocktail à la grandeur d'un gala, notre salle s'adapte à 
            toutes vos ambitions.
          </p>
        </div>

        {/* Event Types Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
             style={{ animationDelay: "200ms" }}>
          {eventTypes.map((event) => (
            <div
              key={event.title}
              className="text-center p-6 md:p-8 border border-background/10 rounded-lg 
                        hover:border-accent/50 hover:bg-background/5 transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 
                            rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
                <event.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-3">
                {event.title}
              </h3>
              <p className="text-background/60 text-sm">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap justify-center gap-12 md:gap-20 mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
             style={{ animationDelay: "300ms" }}>
          <div className="text-center">
            <p className="font-display text-5xl md:text-6xl text-accent mb-2">500+</p>
            <p className="text-background/60 text-sm tracking-widest uppercase">Places assises</p>
          </div>
          <div className="text-center">
            <p className="font-display text-5xl md:text-6xl text-accent mb-2">1200</p>
            <p className="text-background/60 text-sm tracking-widest uppercase">M² modulables</p>
          </div>
          <div className="text-center">
            <p className="font-display text-5xl md:text-6xl text-accent mb-2">HD</p>
            <p className="text-background/60 text-sm tracking-widest uppercase">Équipement sonore</p>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mb-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "bg-accent w-6" : "bg-background/40"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
             style={{ animationDelay: "400ms" }}>
          <Link to="/contact">
            <Button 
              variant="hero" 
              size="xl" 
              className="group border-background/80 text-background hover:bg-background hover:text-foreground"
            >
              Organiser votre événement
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpectacleSection;
