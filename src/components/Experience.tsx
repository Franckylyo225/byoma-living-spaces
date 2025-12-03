import { useEffect, useRef, useState } from "react";
import { Sparkles, Clock, Shield, Wifi, Coffee, Car } from "lucide-react";

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
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 md:py-32 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-24 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="h-px w-16 bg-primary-foreground/30 mx-auto mb-8" />
          <p className="text-primary-foreground/60 tracking-luxury uppercase text-sm mb-4">
            L'Expérience BYOMA
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Des Services
            <br />
            <span className="italic">Pensés pour Vous</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Nous anticipons vos besoins pour que chaque instant de votre 
            séjour soit un moment de sérénité absolue.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group text-center ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary-foreground/20 mb-6 group-hover:border-primary-foreground/50 group-hover:bg-primary-foreground/5 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl mb-3">{feature.title}</h3>
              <p className="text-primary-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-primary-foreground/10 ${isVisible ? "animate-fade-in delay-500" : "opacity-0"}`}>
          {[
            { number: "98%", label: "Satisfaction Client" },
            { number: "15+", label: "Résidences" },
            { number: "24/7", label: "Support Dédié" },
            { number: "5★", label: "Note Moyenne" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-primary-foreground mb-2">
                {stat.number}
              </p>
              <p className="text-primary-foreground/50 text-sm tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
