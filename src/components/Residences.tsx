import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import suiteImage from "@/assets/residence-suite.jpg";
import loungeImage from "@/assets/residence-lounge.jpg";
import terraceImage from "@/assets/residence-terrace.jpg";

const Residences = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const residences = [
    {
      image: suiteImage,
      title: "Suite Prestige",
      subtitle: "60 m² • Vue Panoramique",
      description: "Un havre de paix avec chambre séparée, salon spacieux et terrasse privative.",
    },
    {
      image: loungeImage,
      title: "Appartement Élégance",
      subtitle: "85 m² • Jusqu'à 4 personnes",
      description: "L'espace idéal pour les familles ou séjours prolongés avec cuisine équipée.",
    },
    {
      image: terraceImage,
      title: "Penthouse Signature",
      subtitle: "120 m² • Rooftop Exclusif",
      description: "Notre joyau avec terrasse panoramique, jacuzzi et services de conciergerie.",
    },
  ];

  return (
    <section
      id="residences"
      ref={sectionRef}
      className="py-24 md:py-32 bg-secondary"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-24 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="accent-line mx-auto mb-8" />
          <p className="text-accent tracking-luxury uppercase text-sm mb-4">
            Nos Espaces
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Des Résidences
            <br />
            <span className="italic">d'Exception</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Chaque résidence BYOMA est conçue pour offrir une expérience 
            unique, alliant design contemporain et confort inégalé.
          </p>
        </div>

        {/* Residences Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {residences.map((residence, index) => (
            <article
              key={residence.title}
              className={`group bg-card rounded-sm overflow-hidden card-elegant ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={residence.image}
                  alt={residence.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-accent text-sm tracking-wider uppercase mb-2">
                  {residence.subtitle}
                </p>
                <h3 className="font-display text-2xl text-foreground mb-4">
                  {residence.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {residence.description}
                </p>
                <Button
                  variant="luxuryOutline"
                  className="group/btn"
                >
                  Découvrir
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 ${isVisible ? "animate-fade-in delay-600" : "opacity-0"}`}>
          <Button variant="gold" size="xl">
            Voir toutes nos résidences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Residences;
