import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-image.jpg";
import residenceLounge from "@/assets/residence-lounge.jpg";

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

  const scrollToResidences = () => {
    const element = document.getElementById("residences");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-muted/30"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Overlapping Images */}
          <div className={`relative ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {/* Main vertical image */}
            <div className="relative z-10 w-[65%]">
              <img
                src={aboutImage}
                alt="Chambre BYOMA - Confort et élégance"
                className="w-full h-[450px] md:h-[550px] object-cover rounded-lg shadow-2xl"
              />
            </div>
            {/* Second overlapping image */}
            <div 
              className="absolute bottom-0 right-0 w-[55%] z-20 translate-y-8"
              style={{ animationDelay: "200ms" }}
            >
              <img
                src={residenceLounge}
                alt="Expérience culinaire BYOMA"
                className="w-full h-[280px] md:h-[350px] object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className={`lg:pl-8 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`} style={{ animationDelay: "300ms" }}>
            <p className="text-accent tracking-luxury uppercase text-sm mb-4 font-medium">
              Bienvenue
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] text-foreground mb-8 leading-[1.1] font-bold">
              Confort, Élégance
              <br />
              et Hospitalité
              <br />
              d'Exception
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Bienvenue chez BYOMA, où le confort rencontre l'élégance dans un 
              cadre conçu pour la détente et des séjours inoubliables. Situées 
              dans des destinations privilégiées, nos résidences offrent des 
              espaces soigneusement aménagés, des équipements modernes et une 
              hospitalité chaleureuse adaptée à chaque voyageur. Des matins 
              paisibles aux nuits reposantes, chaque détail est pensé pour 
              garantir un séjour fluide, confortable et mémorable.
            </p>
            <Button 
              onClick={scrollToResidences}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base rounded-full"
            >
              Découvrir nos résidences
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
