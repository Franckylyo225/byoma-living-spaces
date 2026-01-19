import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Adresse",
      value: "Cocody Plateau Dokui, Rue Djomi, Abidjan",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+225 07 00 255 295",
    },
    {
      icon: Mail,
      label: "Email",
      value: "lesresidencesbyoma@byoma.ci",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Info */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="accent-line mb-8" />
            <p className="text-accent tracking-luxury uppercase text-sm mb-4">
              Contact
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Planifions Votre
              <br />
              <span className="italic">Prochain Séjour</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Notre équipe est à votre disposition pour répondre à vos 
              questions et vous accompagner dans la préparation de 
              votre expérience BYOMA.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className={`${isVisible ? "animate-fade-in-up delay-200" : "opacity-0"}`}>
            <form
              onSubmit={handleSubmit}
              className="bg-card p-8 md:p-12 rounded-sm border border-border"
            >
              <h3 className="font-display text-2xl text-foreground mb-8">
                Envoyez-nous un message
              </h3>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Prénom
                    </label>
                    <Input
                      placeholder="Votre prénom"
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Nom
                    </label>
                    <Input
                      placeholder="Votre nom"
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="bg-background border-border focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Comment pouvons-nous vous aider ?"
                    rows={5}
                    className="bg-background border-border focus:border-accent resize-none"
                  />
                </div>

                <Button variant="gold" size="xl" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
