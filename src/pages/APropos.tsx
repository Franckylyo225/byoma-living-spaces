import { useEffect } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Heart, Shield, Award } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";
import residenceLounge from "@/assets/residence-lounge.jpg";
import heroApropos from "@/assets/hero-apropos.jpg";

const values = [
  {
    icon: Star,
    title: "Excellence",
    description: "Nous nous engageons à offrir un service irréprochable et des prestations de la plus haute qualité.",
  },
  {
    icon: Heart,
    title: "Hospitalité",
    description: "Chaque client est unique et mérite une attention personnalisée pour un séjour mémorable.",
  },
  {
    icon: Shield,
    title: "Confiance",
    description: "La sécurité et le bien-être de nos hôtes sont au cœur de toutes nos décisions.",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "Nous intégrons les dernières technologies pour améliorer constamment votre expérience.",
  },
];

const APropos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroApropos})`,
          }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-primary-foreground/80">Notre Histoire</p>
          <h1 className="font-display text-5xl md:text-7xl font-light mb-6">
            À Propos de BYOMA
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-light">
            Découvrez l'histoire et les valeurs qui nous animent
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Images */}
            <div className="relative">
              <div className="relative z-10 w-[65%]">
                <img
                  src={aboutImage}
                  alt="Chambre BYOMA"
                  className="w-full h-[450px] md:h-[550px] object-cover rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] z-20 translate-y-8">
                <img
                  src={residenceLounge}
                  alt="Salon BYOMA"
                  className="w-full h-[280px] md:h-[350px] object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:pl-8">
              <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
                Notre Philosophie
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
                Confort, Élégance et
                <br />
                Hospitalité d'Exception
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Bienvenue chez BYOMA, où le confort rencontre l'élégance dans un 
                  cadre conçu pour la détente et des séjours inoubliables. Situées 
                  dans des destinations privilégiées, nos résidences offrent des 
                  espaces soigneusement aménagés, des équipements modernes et une 
                  hospitalité chaleureuse adaptée à chaque voyageur.
                </p>
                <p>
                  Des matins paisibles aux nuits reposantes, chaque détail est pensé pour 
                  garantir un séjour fluide, confortable et mémorable. Notre équipe dévouée 
                  s'engage à anticiper vos besoins et à créer une atmosphère où vous vous 
                  sentirez comme chez vous.
                </p>
                <p>
                  Fondée sur les principes d'excellence et d'innovation, BYOMA représente 
                  une nouvelle vision de l'hospitalité à Abidjan, alliant le charme local 
                  aux standards internationaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4">
              Nos Valeurs
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Ce qui nous guide
            </h2>
            <p className="text-muted-foreground text-lg">
              Nos valeurs fondamentales définissent chaque aspect de l'expérience BYOMA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div 
                key={value.title}
                className="bg-card p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
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

      {/* Team/Mission CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Prêt à vivre l'expérience BYOMA ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Découvrez nos résidences et laissez-nous vous offrir un séjour d'exception.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              Voir nos chambres
            </Button>
            <Button variant="luxuryOutline" size="lg">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default APropos;
