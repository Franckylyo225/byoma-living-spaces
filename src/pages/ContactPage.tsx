import { useEffect } from "react";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroContact from "@/assets/hero-contact.jpg";

const ContactPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
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
    {
      icon: Clock,
      label: "Horaires",
      value: "Lun - Dim : 24h/24",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroContact})`,
          }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-primary-foreground/80">Nous Contacter</p>
          <h1 className="font-display text-5xl md:text-7xl font-light mb-6">
            Contact
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-light">
            Nous sommes à votre écoute
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Info */}
            <div>
              <p className="text-accent tracking-[0.2em] uppercase text-sm mb-4">
                Parlons de votre séjour
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                Planifions Votre
                <br />
                <span className="italic">Prochain Séjour</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                Notre équipe est à votre disposition pour répondre à vos 
                questions et vous accompagner dans la préparation de 
                votre expérience BYOMA. N'hésitez pas à nous contacter 
                par téléphone, email ou via le formulaire ci-contre.
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

              {/* Map placeholder */}
              <div className="mt-12 h-64 bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Carte Google Maps</p>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-card p-8 md:p-12 rounded-lg border border-border"
              >
                <h3 className="font-display text-2xl text-foreground mb-8">
                  Envoyez-nous un message
                </h3>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Prénom *
                      </label>
                      <Input
                        placeholder="Votre prénom"
                        required
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Nom *
                      </label>
                      <Input
                        placeholder="Votre nom"
                        required
                        className="bg-background border-border focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      required
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Sujet
                    </label>
                    <Input
                      placeholder="Objet de votre message"
                      className="bg-background border-border focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={5}
                      required
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

      <Footer />
    </div>
  );
};

export default ContactPage;
