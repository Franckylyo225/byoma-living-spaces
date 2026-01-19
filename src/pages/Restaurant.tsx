import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Utensils, Wine, Leaf, X, ChevronLeft, ChevronRight } from "lucide-react";
import restaurantHero from "@/assets/restaurant-hero.jpg";
import restaurantPlat from "@/assets/restaurant-plat.jpg";
import restaurantSalle from "@/assets/restaurant-salle.jpg";
import restaurantAmbiance from "@/assets/restaurant-ambiance.jpg";

// Menu images
import entree1 from "@/assets/menu/entree-1.jpg";
import entree2 from "@/assets/menu/entree-2.jpg";
import entree3 from "@/assets/menu/entree-3.jpg";
import plat1 from "@/assets/menu/plat-1.jpg";
import plat2 from "@/assets/menu/plat-2.jpg";
import plat3 from "@/assets/menu/plat-3.jpg";
import dessert1 from "@/assets/menu/dessert-1.jpg";
import dessert2 from "@/assets/menu/dessert-2.jpg";
import dessert3 from "@/assets/menu/dessert-3.jpg";

const galleryImages = [
  { src: restaurantSalle, alt: "Salle du restaurant" },
  { src: restaurantAmbiance, alt: "Ambiance du restaurant" },
  { src: restaurantPlat, alt: "Service" },
  { src: restaurantHero, alt: "Bar" },
];

const Restaurant = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  const [activeCategory, setActiveCategory] = useState("Entrées");

  const menuCategories = ["Entrées", "Plats", "Desserts"];

  const menuHighlights: Record<string, { name: string; description: string; price: string; image: string }[]> = {
    "Entrées": [
      { name: "Carpaccio de Saint-Jacques", description: "Agrumes, huile de truffe, herbes fraîches", price: "18 000 FCFA", image: entree1 },
      { name: "Foie Gras Mi-Cuit", description: "Chutney de figues, brioche toastée", price: "21 000 FCFA", image: entree2 },
      { name: "Tartare de Saumon", description: "Avocat, sésame, sauce ponzu", price: "17 000 FCFA", image: entree3 },
      { name: "Velouté de Homard", description: "Cognac flambé, crème fraîche", price: "22 000 FCFA", image: entree1 },
      { name: "Huîtres Fines de Claire", description: "Citron, échalotes, vinaigre", price: "24 000 FCFA", image: entree2 },
      { name: "Burrata Crémeuse", description: "Tomates confites, basilic, pesto", price: "16 000 FCFA", image: entree3 },
    ],
    "Plats": [
      { name: "Filet de Bœuf Wagyu", description: "Jus corsé, légumes de saison, pommes fondantes", price: "42 000 FCFA", image: plat1 },
      { name: "Homard Bleu Rôti", description: "Beurre blanc au champagne, risotto crémeux", price: "51 000 FCFA", image: plat2 },
      { name: "Carré d'Agneau", description: "Croûte d'herbes, jus au thym", price: "34 000 FCFA", image: plat3 },
      { name: "Bar de Ligne", description: "Fenouil braisé, sauce vierge", price: "31 000 FCFA", image: plat1 },
      { name: "Magret de Canard", description: "Cerises, sauce aux épices", price: "29 000 FCFA", image: plat2 },
      { name: "Risotto aux Truffes", description: "Parmesan 24 mois, truffe noire", price: "37 000 FCFA", image: plat3 },
    ],
    "Desserts": [
      { name: "Soufflé au Chocolat Grand Cru", description: "Cœur coulant, glace vanille Bourbon", price: "12 000 FCFA", image: dessert1 },
      { name: "Tarte Tatin Revisitée", description: "Caramel beurre salé, crème fraîche", price: "10 500 FCFA", image: dessert2 },
      { name: "Crème Brûlée", description: "Vanille de Madagascar", price: "9 000 FCFA", image: dessert3 },
      { name: "Paris-Brest", description: "Praliné noisette, chantilly", price: "11 000 FCFA", image: dessert1 },
      { name: "Mousse au Citron", description: "Meringue italienne, zestes confits", price: "9 500 FCFA", image: dessert2 },
      { name: "Mille-Feuille", description: "Vanille, caramel, feuillantine", price: "10 500 FCFA", image: dessert3 },
    ],
  };

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
                src={restaurantPlat}
                alt="Plat signature BYOMA"
                className="w-full h-[500px] object-cover rounded-sm"
              />
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
      <section className="py-20 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Notre Carte</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Découvrez nos créations
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-0 border-b border-border">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "text-foreground border-b-2 border-accent -mb-[1px]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Promotional Banner */}
          <div 
            className="relative rounded-lg overflow-hidden mb-16 max-w-5xl mx-auto"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(139,90,43,0.92), rgba(139,90,43,0.75)), url(${restaurantHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex justify-between items-center p-8 md:p-12">
              <div>
                <p className="text-white/90 text-sm tracking-wider uppercase mb-2 font-medium">
                  {activeCategory === "Entrées" ? "Offre Spéciale Entrées" : activeCategory === "Plats" ? "Menu Dégustation" : "Douceurs du Chef"}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-white mb-2 drop-shadow-md">
                  {activeCategory === "Entrées" ? "Menu Découverte 29 500 FCFA" : activeCategory === "Plats" ? "Menu Prestige 62 000 FCFA" : "Assiette Gourmande 18 500 FCFA"}
                </h3>
                <p className="text-white/80 italic">
                  {activeCategory === "Entrées" ? "3 entrées au choix, boisson incluse" : activeCategory === "Plats" ? "Entrée, plat, dessert, accord mets & vins" : "Sélection de 3 desserts signature"}
                </p>
                <Button variant="elegant" className="mt-6 bg-white text-amber-900 hover:bg-white/90">
                  Voir le Menu
                </Button>
              </div>
              <div className="hidden md:block text-right">
                <p className="font-display text-amber-200 italic text-xl drop-shadow">/// Du Lundi au Jeudi ///</p>
                <p className="font-display text-white text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">HAPPY</p>
                <p className="font-display text-white text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">HOUR</p>
                <p className="text-amber-200 italic mt-2 drop-shadow">// 18h - 20h //</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {menuHighlights[activeCategory].map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  {/* Circular Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors duration-300">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display text-lg text-foreground truncate">{item.name}</h4>
                      <span className="flex-1 border-b border-dotted border-muted-foreground/40 mx-2 hidden sm:block"></span>
                      <span className="font-display text-lg text-accent font-medium">{item.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm italic mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" size="lg">
              Télécharger la carte complète
            </Button>
          </div>
        </div>
      </section>

      {/* Ambiance Gallery Carousel */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Notre Ambiance</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Galerie
            </h2>
          </div>
          
          {/* Main Carousel */}
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="overflow-hidden rounded-sm">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-[500px] object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                      onClick={() => openLightbox(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-accent w-8" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
            {galleryImages.map((image, index) => (
              <img 
                key={index}
                src={image.src}
                alt={image.alt}
                className={`w-full h-24 object-cover rounded-sm cursor-pointer transition-all duration-300 ${
                  currentSlide === index ? "ring-2 ring-accent opacity-100" : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => {
                  setCurrentSlide(index);
                  openLightbox(index);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          
          <img 
            src={galleryImages[lightboxIndex].src}
            alt={galleryImages[lightboxIndex].alt}
            className="max-w-[90vw] max-h-[90vh] object-contain animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
          
          <div className="absolute bottom-6 text-white/60 text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

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
