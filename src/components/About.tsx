import { useEffect, useRef, useState } from "react";

const About = () => {
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

  const values = [
    {
      number: "01",
      title: "Excellence",
      description: "Un engagement sans compromis pour la qualité et le raffinement dans chaque détail.",
    },
    {
      number: "02",
      title: "Innovation",
      description: "Des solutions modernes et intelligentes pour un confort optimal.",
    },
    {
      number: "03",
      title: "Authenticité",
      description: "Une expérience chaleureuse et personnalisée, loin des standards impersonnels.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="accent-line mb-8" />
            <p className="text-accent tracking-luxury uppercase text-sm mb-4">
              Notre Philosophie
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
              Redéfinir
              <br />
              <span className="italic text-accent">l'Hospitalité</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              BYOMA incarne une vision audacieuse de l'hébergement premium. 
              Nous créons des espaces où l'élégance architecturale rencontre 
              le confort absolu, où chaque séjour devient une expérience 
              mémorable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notre approche innovante combine le meilleur de l'hôtellerie 
              traditionnelle avec les attentes des voyageurs modernes, 
              offrant flexibilité, intimité et services d'exception.
            </p>
          </div>

          {/* Right - Values */}
          <div className="space-y-8">
            {values.map((value, index) => (
              <div
                key={value.number}
                className={`group p-8 border border-border rounded-sm hover:border-accent transition-all duration-500 card-elegant ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-4xl text-accent/30 group-hover:text-accent transition-colors">
                    {value.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
