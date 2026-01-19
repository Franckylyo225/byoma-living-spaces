import { useEffect } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  TreePine, 
  Palette, 
  Car, 
  Wifi, 
  Coffee, 
  Waves,
  ChevronRight,
  Quote
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import aboutImage from "@/assets/about-image.jpg";
import residenceLounge from "@/assets/residence-lounge.jpg";
import heroApropos from "@/assets/hero-apropos.jpg";
import suiteImage from "@/assets/residence-suite.jpg";
import terraceImage from "@/assets/residence-terrace.jpg";
import logoSignature from "@/assets/logo-signature.png";

const localAmenities = [
  {
    icon: Utensils,
    title: "Restaurants Locaux",
    description: "Découvrez la richesse culinaire d'Abidjan avec nos recommandations de restaurants traditionnels et gastronomiques à proximité.",
  },
  {
    icon: TreePine,
    title: "Nature & Détente",
    description: "Profitez des espaces verts environnants et des jardins paisibles pour des moments de sérénité absolue.",
  },
  {
    icon: Palette,
    title: "Art & Culture",
    description: "Explorez les galeries d'art, musées et lieux culturels emblématiques de la capitale ivoirienne.",
  },
];

const facilities = [
  {
    icon: Car,
    title: "Parking Privé",
    description: "Un parking sécurisé et surveillé 24h/24 est mis à votre disposition gratuitement.",
  },
  {
    icon: Wifi,
    title: "WiFi Haut Débit",
    description: "Connexion internet très haut débit disponible dans l'ensemble de nos résidences.",
  },
  {
    icon: Coffee,
    title: "Restaurant & Bar",
    description: "Savourez une cuisine raffinée et des cocktails d'exception dans notre espace gastronomique.",
  },
  {
    icon: Waves,
    title: "Espace Bien-être",
    description: "Détendez-vous dans notre espace wellness avec jacuzzi et services de massage sur demande.",
  },
];

const testimonials = [
  {
    name: "Marie Kouassi",
    date: "Janvier 2024",
    text: "Un séjour absolument parfait ! L'accueil chaleureux, les chambres impeccables et le service attentionné ont dépassé toutes mes attentes.",
  },
  {
    name: "Jean-Pierre Diallo",
    date: "Décembre 2023",
    text: "BYOMA est devenu mon adresse incontournable à Abidjan. Le confort et l'élégance des lieux sont incomparables.",
  },
  {
    name: "Aminata Traoré",
    date: "Novembre 2023",
    text: "Une expérience luxueuse dans un cadre moderne et raffiné. Je recommande vivement pour tout séjour d'affaires ou de détente.",
  },
];

const faqs = [
  {
    question: "Quelles sont les conditions d'annulation ?",
    answer: "Les annulations sont gratuites jusqu'à 48 heures avant la date d'arrivée. Au-delà, la première nuit sera facturée. Pour les réservations non remboursables, aucun remboursement n'est possible.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), mobile money (Orange Money, MTN, Wave), virements bancaires et espèces. Un acompte de 50% est requis à la réservation.",
  },
  {
    question: "Quelles sont les heures d'arrivée et de départ ?",
    answer: "L'enregistrement (check-in) est possible à partir de 14h00 et le départ (check-out) doit s'effectuer avant 12h00. Des arrangements peuvent être faits sur demande selon disponibilité.",
  },
  {
    question: "Proposez-vous un service de transfert aéroport ?",
    answer: "Oui, nous proposons un service de transfert depuis et vers l'aéroport Félix Houphouët-Boigny. Merci de nous informer de vos horaires de vol au moins 24h à l'avance.",
  },
  {
    question: "Les animaux de compagnie sont-ils acceptés ?",
    answer: "Nous acceptons les petits animaux de compagnie sur demande préalable et sous réserve de disponibilité de nos chambres adaptées. Un supplément peut s'appliquer.",
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

      {/* Our History Section */}
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
                Résidences BYOMA
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
                Notre Histoire
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Bienvenue chez BYOMA, où le confort rencontre l'élégance dans un 
                  cadre conçu pour la détente et des séjours inoubliables. Situées 
                  au cœur de Cocody, nos résidences offrent des espaces soigneusement 
                  aménagés et une hospitalité chaleureuse.
                </p>
                <p>
                  Notre vision est née d'une passion profonde pour l'hospitalité 
                  d'excellence et d'un désir de créer un lieu où chaque visiteur 
                  se sentirait comme chez lui, tout en bénéficiant des standards 
                  les plus élevés de confort et de service.
                </p>
                <p>
                  Des matins paisibles aux nuits reposantes, chaque détail est pensé 
                  pour garantir un séjour fluide, confortable et mémorable. Notre équipe 
                  dévouée s'engage à anticiper vos besoins et à créer une atmosphère 
                  unique et personnalisée.
                </p>
              </div>
              
              {/* Signature */}
              <div className="mt-10 pt-8 border-t border-border">
                <img 
                  src={logoSignature} 
                  alt="Signature" 
                  className="h-16 mb-4 opacity-80"
                />
                <p className="font-display text-xl italic text-foreground">
                  L'équipe BYOMA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Amenities Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4 font-medium">
                Résidences BYOMA
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8">
                Découvrez les Alentours
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Idéalement situées à Cocody Plateau Dokui, nos résidences vous offrent 
                un accès privilégié aux meilleures adresses d'Abidjan. Laissez-vous 
                guider par nos recommandations locales.
              </p>

              <div className="space-y-8">
                {localAmenities.map((amenity) => (
                  <div key={amenity.title} className="flex gap-5">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <amenity.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-foreground mb-2">
                        {amenity.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={suiteImage} 
                alt="Suite BYOMA" 
                className="w-full h-64 object-cover rounded-lg shadow-lg col-span-2"
              />
              <img 
                src={terraceImage} 
                alt="Terrasse BYOMA" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
              <img 
                src={residenceLounge} 
                alt="Lounge BYOMA" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4">
              Témoignages
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card p-8 rounded-lg border border-border relative"
              >
                <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-display text-lg text-accent">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Facilities Section */}
      <section 
        className="py-20 md:py-32 relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${heroApropos})`,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4">
              Résidences BYOMA
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-primary-foreground">
              Nos Installations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility) => (
              <div 
                key={facility.title}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <facility.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl text-primary-foreground mb-3">
                  {facility.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Title */}
            <div className="lg:sticky lg:top-32">
              <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4">
                Résidences BYOMA - FAQ
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                Questions Fréquentes
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Vous ne trouvez pas la réponse à votre question ? 
                N'hésitez pas à nous contacter directement.
              </p>
              <Link to="/contact">
                <Button variant="gold" size="lg" className="group">
                  Contactez-nous
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Right - Accordion */}
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-display text-lg hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Prêt à vivre l'expérience BYOMA ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Découvrez nos résidences et laissez-nous vous offrir un séjour d'exception.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chambres">
              <Button variant="gold" size="lg">
                Voir nos chambres
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="luxuryOutline" size="lg">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default APropos;