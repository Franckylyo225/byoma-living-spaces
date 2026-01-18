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
      detail: "Service 24h/24",
    },
    {
      icon: Clock,
      title: "Check-in Flexible",
      description: "Arrivée autonome 24h/24 avec notre système d'accès intelligent.",
      detail: "Accès digital",
    },
    {
      icon: Shield,
      title: "Sécurité Totale",
      description: "Résidences sécurisées avec système de surveillance et accès contrôlé.",
      detail: "Surveillance 24/7",
    },
    {
      icon: Wifi,
      title: "Connectivité Premium",
      description: "WiFi très haut débit et équipements connectés dans chaque résidence.",
      detail: "Fibre optique",
    },
    {
      icon: Coffee,
      title: "Petit-Déjeuner Inclus",
      description: "Sélection gourmet livrée directement dans votre résidence.",
      detail: "Produits locaux",
    },
    {
      icon: Car,
      title: "Mobilité Facilitée",
      description: "Parking privé et service de voiturier sur demande.",
      detail: "Parking sécurisé",
    },
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="h-px w-16 bg-gold/50 mx-auto mb-8" />
          <p className="text-gold tracking-luxury uppercase text-sm mb-4">
            L'Expérience BYOMA
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Des Services
            <br />
            <span className="italic text-gold">Pensés pour Vous</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nous anticipons vos besoins pour que chaque instant de votre 
            séjour soit un moment de sérénité absolue.
          </p>
        </div>

        {/* Features Grid - Premium Cards with Hover */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative bg-card border border-border/50 rounded-xl p-8 
                         transition-all duration-500 ease-out
                         hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5
                         hover:-translate-y-2
                         ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon container */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center
                               group-hover:bg-gold/10 transition-colors duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors duration-500" />
                </div>
                
                {/* Detail badge - appears on hover */}
                <span className="absolute -top-2 -right-2 px-3 py-1 text-xs font-medium tracking-wider uppercase
                                bg-gold text-charcoal rounded-full
                                opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                                transition-all duration-300 delay-100">
                  {feature.detail}
                </span>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent 
                             scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </div>
          ))}
        </div>

        {/* Stats - More elegant version */}
        <div className={`mt-24 pt-16 border-t border-border/30 ${isVisible ? "animate-fade-in delay-500" : "opacity-0"}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "98%", label: "Satisfaction Client" },
              { number: "15+", label: "Résidences" },
              { number: "24/7", label: "Support Dédié" },
              { number: "5★", label: "Note Moyenne" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center group cursor-default"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <p className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-2 
                             group-hover:text-gold transition-colors duration-300">
                  {stat.number}
                </p>
                <p className="text-muted-foreground text-sm tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
