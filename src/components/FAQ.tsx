import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "Quels sont les horaires d'arrivée et de départ ?",
    answer:
      "L'arrivée (check-in) s'effectue à partir de 15h00 et le départ (check-out) avant 11h00. Un early check-in ou late check-out peut être arrangé sur demande, sous réserve de disponibilité.",
  },
  {
    question: "Les animaux de compagnie sont-ils acceptés ?",
    answer:
      "Oui, nous accueillons les animaux de compagnie dans certaines de nos résidences. Un supplément peut s'appliquer. Merci de nous contacter à l'avance pour organiser votre séjour avec votre compagnon.",
  },
  {
    question: "Proposez-vous des services de conciergerie ?",
    answer:
      "Absolument. Notre équipe de conciergerie est disponible 24h/24 pour organiser vos réservations de restaurants, transferts aéroport, excursions, soins spa et toute autre demande personnalisée.",
  },
  {
    question: "Quelles sont les options de stationnement ?",
    answer:
      "Toutes nos résidences disposent d'un parking privé sécurisé gratuit. Un service de voiturier est également disponible sur demande pour nos suites Prestige et Penthouse.",
  },
  {
    question: "Quelle est la politique d'annulation ?",
    answer:
      "Les annulations effectuées jusqu'à 7 jours avant la date d'arrivée sont intégralement remboursées. Entre 7 et 3 jours, 50% du montant est retenu. Moins de 3 jours avant l'arrivée, le montant total est dû.",
  },
  {
    question: "Les résidences sont-elles équipées d'une cuisine ?",
    answer:
      "Oui, toutes nos résidences disposent d'une cuisine entièrement équipée avec électroménager haut de gamme, ustensiles, vaisselle et produits de base. Un service de chef privé peut également être réservé.",
  },
];

const FAQ = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div
          className={`text-center mb-16 md:mb-20 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <span className="inline-block text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Questions Fréquentes
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Tout ce que vous
            <br />
            <span className="italic text-gold">devez savoir</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus fréquemment posées
            concernant nos résidences et services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div
          className={`max-w-3xl mx-auto ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gold/20 rounded-sm px-6 data-[state=open]:border-gold/40 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-gold transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div
          className={`text-center mt-12 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-muted-foreground">
            Vous avez d'autres questions ?{" "}
            <a
              href="#contact"
              className="text-gold hover:underline underline-offset-4"
            >
              Contactez-nous
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
