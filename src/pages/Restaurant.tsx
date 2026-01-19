import { useEffect } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Utensils, Wine, Leaf } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
const Restaurant = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const menuHighlights = [
    {
      category: "Entrées",
      items: [
        { name: "Carpaccio de Saint-Jacques", description: "Agrumes, huile de truffe, herbes fraîches", price: "28€" },
        { name: "Foie Gras Mi-Cuit", description: "Chutney de figues, brioche toastée", price: "32€" },
      ]
    },
    {
      category: "Plats",
      items: [
        { name: "Filet de Bœuf Wagyu", description: "Jus corsé, légumes de saison, pommes fondantes", price: "65€" },
        { name: "Homard Bleu Rôti", description: "Beurre blanc au champagne, risotto crémeux", price: "78€" },
      ]
    },
    {
      category: "Desserts",
      items: [
        { name: "Soufflé au Chocolat Grand Cru", description: "Cœur coulant, glace vanille Bourbon", price: "18€" },
        { name: "Tarte Tatin Revisitée", description: "Caramel beurre salé, crème fraîche", price: "16€" },
      ]
    }
  ];

  const features = [
    { icon: Utensils, title: "Cuisine Gastronomique", description: "Une cuisine raffinée mêlant traditions et modernité" },
    { icon: Wine, title: "Cave d'Exception", description: "Plus de 500 références de vins français et internationaux" },
    { icon: Leaf, title: "Produits Locaux", description: "Approvisionnement auprès de producteurs locaux sélectionnés" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${restaurantHero})`,
          }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-primary-foreground/80">Restaurant Gastronomique</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light mb-6">
            BYOMA SIGNATURE
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-light">
            Une expérience culinaire d'exception au cœur de notre résidence
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">L'Art de la Table</p>
              <h2 className="font-display text-4xl md:text-5xl font-light mb-6 text-foreground">
                Une cuisine d'auteur
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Au BYOMA SIGNATURE, notre Chef étoilé vous invite à un voyage gustatif unique. 
                Chaque plat est une œuvre d'art, créée avec passion à partir des meilleurs 
                produits de saison soigneusement sélectionnés auprès de nos producteurs locaux.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Dans un cadre élégant et intimiste, découvrez une cuisine qui célèbre les saveurs 
                authentiques tout en embrassant l'innovation culinaire contemporaine.
              </p>
              <Button variant="elegant" size="lg">
                Réserver une table
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070"
                alt="Plat signature BYOMA"
                className="w-full h-[500px] object-cover rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-sm">
                <p className="font-display text-3xl font-light">1★</p>
                <p className="text-sm tracking-wider">Michelin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8">
                <feature.icon className="w-12 h-12 mx-auto mb-6 text-accent" />
                <h3 className="font-display text-2xl font-light mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Notre Carte</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Sélection du Chef
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {menuHighlights.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                <h3 className="font-display text-2xl text-accent mb-6 text-center">{section.category}</h3>
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start border-b border-border pb-4">
                      <div>
                        <h4 className="font-display text-xl text-foreground mb-1">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <span className="font-display text-xl text-accent ml-4">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir la carte complète
            </Button>
          </div>
        </div>
      </section>

      {/* Ambiance Gallery */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070"
              alt="Salle du restaurant"
              className="w-full h-80 object-cover rounded-sm"
            />
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074"
              alt="Bar à vins"
              className="w-full h-80 object-cover rounded-sm"
            />
            <img 
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070"
              alt="Terrasse"
              className="w-full h-80 object-cover rounded-sm"
            />
          </div>
        </div>
      </section>

      {/* Practical Info */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Informations Pratiques</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
                Nous rejoindre
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Clock className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="font-display text-xl mb-2 text-foreground">Horaires</h3>
                <p className="text-muted-foreground text-sm">
                  Déjeuner : 12h00 - 14h00<br />
                  Dîner : 19h00 - 22h00<br />
                  Fermé le lundi
                </p>
              </div>
              <div className="p-6">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="font-display text-xl mb-2 text-foreground">Adresse</h3>
                <p className="text-muted-foreground text-sm">
                  BYOMA Résidence<br />
                  Cocody Plateau Dokui, Rue Djomi<br />
                  Abidjan
                </p>
              </div>
              <div className="p-6">
                <Phone className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="font-display text-xl mb-2 text-foreground">Réservations</h3>
                <p className="text-muted-foreground text-sm">
                  +225 07 15 72 78 07<br />
                  +225 05 54 12 69 69<br />
                  lesresidencesbyoma@byoma.ci
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button variant="elegant" size="lg">
                Réserver maintenant
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Restaurant;
