import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroResidence from "@/assets/hero-residence.jpg";
import residenceSuite from "@/assets/residence-suite.jpg";

const Experience = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const features = [
    {
      label: "Service Premium",
      description: "Conciergerie personnalisée disponible pour répondre à toutes vos demandes.",
    },
    {
      label: "Sécurité Totale",
      description: "Résidences sécurisées avec système de surveillance et accès contrôlé.",
    },
    {
      label: "Suites & Chambres VIP",
      description: "Hébergements d'exception avec équipements haut de gamme.",
    },
    {
      label: "Mobilité Facilitée",
      description: "Services de navette pour vos déplacements en toute sérénité.",
    },
  ];

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <span className="inline-block text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">
            L'Expérience BYOMA
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Nos Prestations
            <br />
            <span className="italic text-gold">d'Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des équipements premium aux services personnalisés, notre équipe
            assure un séjour confortable et mémorable du check-in au check-out.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          {/* Left - Large Image */}
          <div className="relative h-[400px] lg:h-[600px] rounded-sm overflow-hidden">
            <img
              src={heroResidence}
              alt="Intérieur luxueux BYOMA"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className="bg-cream p-6 md:p-8 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-foreground mb-2">
                    {feature.label}
                  </p>
                  <div className="h-px w-full bg-gold/30" />
                </div>
                <div className="mt-auto pt-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
