import { MapPin, Phone, Mail } from "lucide-react";
const TopBar = () => {
  return <div className="bg-primary text-primary-foreground py-2 text-xs tracking-wide">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cocody Plateau Dokui, Rue Djomi, Abidjan</span>
            <span className="sm:hidden">Paris</span>
          </a>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="tel:+22507002552956" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+225 07 00 255 295</span>
            <span className="sm:hidden">Appeler</span>
          </a>
          <a href="mailto:lesresidencesbyoma@byoma.ci" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">lesresidencesbyoma@byoma.ci</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>
      </div>
    </div>;
};
export default TopBar;