import { useEffect, useRef, useState } from "react";
import { Sparkles, Clock, Shield, Wifi, Coffee, Car, UtensilsCrossed, Theater } from "lucide-react";

const Experience = () => {
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
      icon: Sparkles,
      title: "Service Premium",
      description: "Conciergerie personnalisée disponible pour répondre à toutes vos demandes.",
    },
    {
      icon: Clock,
      title: "Check-in Flexible",
      description: "Arrivée autonome 24h/24 avec notre système d'accès intelligent.",
    },
    {
      icon: Shield,
      title: "Sécurité Totale",
      description: "Résidences sécurisées avec système de surveillance et accès contrôlé.",
    },
    {
      icon: Wifi,
      title: "Connectivité Premium",
      description: "WiFi très haut débit et équipements connectés dans chaque résidence.",
    },
    {
      icon: Coffee,
      title: "Petit-Déjeuner Inclus",
      description: "Sélection gourmet livrée directement dans votre résidence.",
    },
    {
      icon: Car,
      title: "Mobilité Facilitée",
      description: "Parking privé et service de voiturier sur demande.",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurant & Bar",
      description: "Cuisine gastronomique et cocktails signature dans un cadre raffiné.",
    },
    {
      icon: Theater,
      title: "Salle de Spectacle",
      description: "Événements culturels et soirées exclusives dans notre espace dédié.",
    },
  ];

  const marqueeExpressions = [
    "Luxury",
    "Évasion",
    "Découverte",
    "Confort",
    "Élégance",
    "Voyage",
    "Sérénité",
    "Excellence",
    "Hospitalité",
    "Aventure",
    "Prestige",
    "Bien-être",
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 md:py-32 bg-secondary/30"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <p className="text-accent tracking-luxury uppercase text-sm mb-4">
            Résidences BYOMA
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            L'Expérience BYOMA
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nous anticipons vos besoins pour que chaque instant de votre 
            séjour soit un moment de sérénité absolue.
          </p>
        </div>

        {/* Features Grid - Clean Minimal Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
             style={{ animationDelay: "200ms" }}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`relative text-center py-12 px-6 md:px-8
                         ${index < features.length - (features.length % 4 === 0 ? 4 : features.length % 4) ? "border-b border-border/30" : ""}
                         ${index % 4 !== 3 && index % 4 !== (features.length - 1) % 4 ? "lg:border-r lg:border-border/30" : ""}
                         ${index % 2 === 0 ? "border-r border-border/30 lg:border-r-0" : ""}
                         ${index % 4 !== 3 ? "lg:border-r lg:border-border/30" : "lg:border-r-0"}
                         group hover:bg-accent/5 transition-colors duration-300`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <feature.icon className="w-12 h-12 text-accent stroke-[1.25] group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Large Marquee */}
      <div className={`mt-24 overflow-hidden ${isVisible ? "animate-fade-in" : "opacity-0"}`}
           style={{ animationDelay: "400ms" }}>
        <div className="relative flex">
          {/* First marquee track */}
          <div className="flex animate-marquee whitespace-nowrap">
            {marqueeExpressions.map((expression, index) => (
              <span
                key={`first-${index}`}
                className="font-display text-7xl md:text-8xl lg:text-9xl text-transparent 
                         bg-clip-text bg-gradient-to-r from-accent/20 to-accent/10
                         mx-8 md:mx-12 italic tracking-tight select-none"
              >
                {expression}
              </span>
            ))}
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
            {marqueeExpressions.map((expression, index) => (
              <span
                key={`second-${index}`}
                className="font-display text-7xl md:text-8xl lg:text-9xl text-transparent 
                         bg-clip-text bg-gradient-to-r from-accent/20 to-accent/10
                         mx-8 md:mx-12 italic tracking-tight select-none"
              >
                {expression}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
