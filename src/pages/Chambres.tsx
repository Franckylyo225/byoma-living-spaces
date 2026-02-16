import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bed, Users, Maximize, Wifi, Car, Coffee, ArrowRight, CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroChambres from "@/assets/hero-chambres.jpg";

interface RoomTypeImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface RoomType {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  base_price: number;
  total_rooms: number;
  amenities: unknown;
  image_url: string | null;
}

const commonAmenities = [
  { icon: Wifi, label: "WiFi Haut Débit" },
  { icon: Car, label: "Parking Sécurisé" },
  { icon: Coffee, label: "Petit-déjeuner Inclus" },
  { icon: Bed, label: "Literie Premium" },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
};

const getAmenitiesArray = (amenities: unknown): string[] => {
  if (Array.isArray(amenities)) return amenities;
  if (typeof amenities === "string") return amenities.split(",").map((a) => a.trim());
  return [];
};

const ImageGallery = ({ images, mainImage }: { images: RoomTypeImage[]; mainImage: string | null }) => {
  const [current, setCurrent] = useState(0);
  const allImages = images.length > 0 ? images.map(i => i.image_url) : mainImage ? [mainImage] : [];

  if (allImages.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-secondary rounded-lg shadow-2xl flex items-center justify-center">
        <Bed className="w-16 h-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-lg shadow-2xl overflow-hidden group">
      <img src={allImages[current]} alt="" className="w-full h-full object-cover transition-all duration-500" />
      {allImages.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((current - 1 + allImages.length) % allImages.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((current + 1) % allImages.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? "bg-background w-5" : "bg-background/50"}`}
              />
            ))}
          </div>
        </>
      )}
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${idx === current ? "border-background" : "border-transparent opacity-70"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Chambres = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomTypeImages, setRoomTypeImages] = useState<Record<string, RoomTypeImage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    check_in_date: searchParams.get("checkin") || "",
    check_out_date: searchParams.get("checkout") || "",
    num_guests: parseInt(searchParams.get("guests") || "1"),
    special_requests: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    const [typesRes, imagesRes] = await Promise.all([
      supabase.from("room_types").select("*").order("base_price", { ascending: true }),
      supabase.from("room_type_images").select("*").order("display_order", { ascending: true }),
    ]);

    if (typesRes.error) {
      toast({ variant: "destructive", title: "Erreur", description: typesRes.error.message });
    } else {
      setRoomTypes(typesRes.data || []);
    }

    // Group images by room_type_id
    const grouped: Record<string, RoomTypeImage[]> = {};
    (imagesRes.data || []).forEach((img: any) => {
      if (!grouped[img.room_type_id]) grouped[img.room_type_id] = [];
      grouped[img.room_type_id].push(img);
    });
    setRoomTypeImages(grouped);

    setIsLoading(false);
  };

  const openBooking = (type: RoomType) => {
    setSelectedType(type);
    setBookingSuccess(false);
    setIsBookingOpen(true);
  };

  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    const diff = new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setIsSubmitting(true);

    try {
      // Create guest
      const { data: guestData, error: guestError } = await supabase
        .from("guests")
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
        })
        .select("id")
        .single();

      if (guestError) throw guestError;

      const nights = calculateNights();
      const totalPrice = selectedType.base_price * nights;

      // Create reservation
      const { error: resError } = await supabase.from("reservations").insert({
        guest_id: guestData.id,
        room_type_id: selectedType.id,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        num_guests: formData.num_guests,
        special_requests: formData.special_requests || null,
        total_price: totalPrice,
        reservation_number: `RES-${Date.now()}`,
      });

      if (resError) throw resError;

      setBookingSuccess(true);
      toast({ title: "Réservation confirmée !", description: "Vous recevrez un email de confirmation." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroChambres})`,
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

      {/* Room Types */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
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
            <div className="space-y-24">
              {roomTypes.map((type, index) => {
                const amenities = getAmenitiesArray(type.amenities);
                return (
                  <article
                    key={type.id}
                    className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
                  >
                    {/* Image Gallery */}
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <ImageGallery
                        images={roomTypeImages[type.id] || []}
                        mainImage={type.image_url}
                      />
                    </div>

                    {/* Content */}
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <p className="text-accent text-sm tracking-widest uppercase mb-2">
                        {type.total_rooms} chambre{type.total_rooms > 1 ? "s" : ""} disponible{type.total_rooms > 1 ? "s" : ""}
                      </p>
                      <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Jusqu'à {type.capacity} personne{type.capacity > 1 ? "s" : ""}
                        </span>
                      </div>
                      <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                        {type.name}
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                        {type.description || "Un espace confortable et soigné pour un séjour d'exception."}
                      </p>

                      {/* Price */}
                      <p className="text-2xl font-semibold text-accent mb-6">
                        {formatPrice(type.base_price)}<span className="text-base font-normal text-muted-foreground"> / nuit</span>
                      </p>

                      {/* Amenities */}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-8">
                          {amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button variant="gold" size="lg" className="group" onClick={() => openBooking(type)}>
                        Réserver
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {bookingSuccess ? "Réservation confirmée" : `Réserver — ${selectedType?.name}`}
            </DialogTitle>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg text-foreground">Votre réservation a été enregistrée avec succès !</p>
              <p className="text-muted-foreground">Notre équipe vous contactera pour confirmer votre séjour.</p>
              <Button variant="gold" onClick={() => setIsBookingOpen(false)}>Fermer</Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in *</Label>
                  <Input
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check-out *</Label>
                  <Input
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                    min={formData.check_in_date || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre de personnes</Label>
                <Input
                  type="number"
                  min="1"
                  max={selectedType?.capacity || 4}
                  value={formData.num_guests}
                  onChange={(e) => setFormData({ ...formData, num_guests: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Demandes spéciales</Label>
                <Textarea
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  placeholder="Arrivée tardive, lit bébé, etc."
                  rows={2}
                />
              </div>

              {/* Price Summary */}
              {nights > 0 && selectedType && (
                <div className="bg-secondary rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(selectedType.base_price)} × {nights} nuit{nights > 1 ? "s" : ""}</span>
                    <span>{formatPrice(selectedType.base_price * nights)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(selectedType.base_price * nights)}</span>
                  </div>
                </div>
              )}

              <Button type="submit" variant="gold" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Réservation en cours...
                  </>
                ) : (
                  "Confirmer la réservation"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Notre équipe est à votre disposition pour vous aider à trouver l'hébergement parfait pour votre séjour.
          </p>
          <Button variant="elegant" size="lg" onClick={() => navigate("/contact")}>
            Contactez-nous
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chambres;
