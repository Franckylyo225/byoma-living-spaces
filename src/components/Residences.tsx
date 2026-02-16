import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bed, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import suiteImage from "@/assets/residence-suite.jpg";
import loungeImage from "@/assets/residence-lounge.jpg";
import terraceImage from "@/assets/residence-terrace.jpg";

interface RoomType {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  base_price: number;
  total_rooms: number;
  image_url: string | null;
}

const fallbackImages = [suiteImage, loungeImage, terraceImage];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

const Residences = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      const { data } = await supabase
        .from("room_types")
        .select("id, name, description, capacity, base_price, total_rooms, image_url")
        .order("base_price", { ascending: true });
      setRoomTypes(data || []);
      setIsLoading(false);
    };
    fetchRoomTypes();
  }, []);

  return (
    <section
      id="residences"
      ref={sectionRef}
      className="py-24 md:py-32 bg-secondary"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 md:mb-24 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="accent-line mx-auto mb-8" />
          <p className="text-accent tracking-luxury uppercase text-sm mb-4">
            Nos Espaces
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Des Résidences
            <br />
            <span className="italic">d'Exception</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Chaque résidence BYOMA est conçue pour offrir une expérience 
            unique, alliant design contemporain et confort inégalé.
          </p>
        </div>

        {/* Residences Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="text-center py-20">
            <Bed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Les chambres seront bientôt disponibles.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.map((type, index) => (
              <article
                key={type.id}
                className={`group bg-card rounded-sm overflow-hidden card-elegant ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={type.image_url || fallbackImages[index % fallbackImages.length]}
                    alt={type.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-accent text-sm tracking-wider uppercase mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {type.capacity} pers.
                    </span>
                    <span>•</span>
                    <span>{type.total_rooms} chambre{type.total_rooms > 1 ? "s" : ""}</span>
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-2">
                    {type.name}
                  </h3>
                  <p className="text-xl font-semibold text-accent mb-4">
                    {formatPrice(type.base_price)}<span className="text-sm font-normal text-muted-foreground"> / nuit</span>
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                    {type.description || "Un espace confortable et soigné pour un séjour d'exception."}
                  </p>
                  <Button
                    variant="luxuryOutline"
                    className="group/btn"
                    onClick={() => navigate("/chambres")}
                  >
                    Réserver
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`text-center mt-16 ${isVisible ? "animate-fade-in delay-600" : "opacity-0"}`}>
          <Button variant="gold" size="xl" onClick={() => navigate("/chambres")}>
            Voir toutes nos résidences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Residences;
