import { useEffect, useRef, useState } from "react";
import aboutImage from "@/assets/about-image.jpg";

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
        {/* Top Section: Text Left, Image Right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
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

          {/* Right Image */}
          <div className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={aboutImage}
                alt="Expérience BYOMA - Confort et élégance"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom Section: 3 Value Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={value.number}
              className={`group p-8 border border-border rounded-sm hover:border-accent transition-all duration-500 card-elegant text-center ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${(index + 1) * 150 + 300}ms` }}
            >
              <span className="font-display text-5xl text-accent/30 group-hover:text-accent transition-colors block mb-4">
                {value.number}
              </span>
              <h3 className="font-display text-2xl text-foreground mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
