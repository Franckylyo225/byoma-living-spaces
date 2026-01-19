import { Instagram, Facebook, Linkedin } from "lucide-react";
import logoByoma from "@/assets/logo-byoma.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    residences: [
      { label: "Suite Prestige", href: "#" },
      { label: "Appartement Élégance", href: "#" },
      { label: "Penthouse Signature", href: "#" },
      { label: "Offres Spéciales", href: "#" },
    ],
    company: [
      { label: "Notre Histoire", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Partenaires", href: "#" },
      { label: "Presse", href: "#" },
    ],
    support: [
      { label: "FAQ", href: "#" },
      { label: "Conditions Générales", href: "#" },
      { label: "Politique de Confidentialité", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  };

  const socials = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={logoByoma} 
              alt="BYOMA Résidence" 
              className="h-16 md:h-20 w-auto mb-6"
            />
            <p className="text-primary-foreground/60 leading-relaxed max-w-sm mb-6">
              Résidences hôtelières d'exception. Redéfinir l'art de 
              séjourner avec élégance, confort et innovation.
            </p>
            <div className="text-primary-foreground/60 text-sm space-y-2 mb-8">
              <p>📍 Cocody Plateau Dokui, Rue Djomi, Abidjan</p>
              <p>📞 +225 07 00 255 295</p>
              <p>✉️ lesresidencesbyoma@byoma.ci</p>
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-primary-foreground/50 hover:bg-primary-foreground/5 transition-all"
                >
                  <social.icon className="w-4 h-4 text-primary-foreground/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Residences */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-6 text-primary-foreground/80">
              Résidences
            </h3>
            <ul className="space-y-3">
              {links.residences.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-6 text-primary-foreground/80">
              Entreprise
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-6 text-primary-foreground/80">
              Support
            </h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">
            © {currentYear} BYOMA. Tous droits réservés.
          </p>
          <p className="text-primary-foreground/40 text-sm">
            Conçu avec passion pour l'excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
