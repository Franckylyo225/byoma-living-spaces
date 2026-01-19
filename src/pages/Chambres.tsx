import { useEffect } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Bed, Users, Maximize, Wifi, Car, Coffee, ArrowRight } from "lucide-react";
import suiteImage from "@/assets/residence-suite.jpg";
import loungeImage from "@/assets/residence-lounge.jpg";
import terraceImage from "@/assets/residence-terrace.jpg";
import heroResidence from "@/assets/hero-residence.jpg";

const rooms = [
  {
    image: suiteImage,
    title: "Suite Prestige",
    surface: "60 m²",
    capacity: "2 personnes",
    description: "Un havre de paix avec chambre séparée, salon spacieux et terrasse privative offrant une vue panoramique sur la ville.",
    amenities: ["Lit King Size", "Terrasse privée", "Salle de bain en marbre", "Mini-bar"],
    price: "150 000 FCFA",
  },
  {
    image: loungeImage,
    title: "Appartement Élégance",
    surface: "85 m²",
    capacity: "Jusqu'à 4 personnes",
    description: "L'espace idéal pour les familles ou séjours prolongés avec cuisine équipée, salon confortable et deux chambres.",
    amenities: ["2 Chambres", "Cuisine équipée", "Salon séparé", "Balcon"],
    price: "220 000 FCFA",
  },
  {
    image: terraceImage,
    title: "Penthouse Signature",
    surface: "120 m²",
    capacity: "Jusqu'à 6 personnes",
    description: "Notre joyau avec terrasse panoramique, jacuzzi privé et services de conciergerie dédiés pour une expérience unique.",
    amenities: ["Rooftop exclusif", "Jacuzzi privé", "Conciergerie 24h/24", "Vue 360°"],
    price: "350 000 FCFA",
  },
];

const commonAmenities = [
  { icon: Wifi, label: "WiFi Haut Débit" },
  { icon: Car, label: "Parking Sécurisé" },
  { icon: Coffee, label: "Petit-déjeuner Inclus" },
  { icon: Bed, label: "Literie Premium" },
];

const Chambres = () => {
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
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroResidence})`,
          }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-primary-foreground/80">Hébergement de Luxe</p>
          <h1 className="font-display text-5xl md:text-7xl font-light mb-6">
            Nos Chambres & Suites
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-light">
            Des espaces conçus pour votre confort et votre bien-être
          </p>
        </div>
      </section>

      {/* Common Amenities */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {commonAmenities.map((amenity) => (
              <div key={amenity.label} className="flex items-center gap-3">
                <amenity.icon className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms List */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {rooms.map((room, index) => (
              <article 
                key={room.title}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-2xl"
                  />
                  <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                    À partir de {room.price}/nuit
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Maximize className="w-4 h-4" />
                      {room.surface}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {room.capacity}
                    </span>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                    {room.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {room.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {room.amenities.map((amenity) => (
                      <span 
                        key={amenity}
                        className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Button variant="gold" size="lg" className="group">
                    Réserver cette chambre
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Notre équipe est à votre disposition pour vous aider à trouver l'hébergement parfait pour votre séjour.
          </p>
          <Button variant="elegant" size="lg">
            Contactez-nous
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chambres;
