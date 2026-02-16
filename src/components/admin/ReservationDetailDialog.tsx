import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Phone, Mail, MapPin, CreditCard, MessageSquare, Hash, Users, BedDouble } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReservationDetail {
  id: string;
  reservation_number: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_price: number | null;
  status: string;
  special_requests: string | null;
  created_at: string;
  guest: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
  } | null;
  room_type: {
    name: string;
    base_price: number;
  } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  checked_in: "Check-in",
  checked_out: "Check-out",
  cancelled: "Annulée",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
};

interface Props {
  reservation: ReservationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservationDetailDialog = ({ reservation, open, onOpenChange }: Props) => {
  if (!reservation) return null;

  const nights = Math.ceil(
    (new Date(reservation.check_out_date).getTime() - new Date(reservation.check_in_date).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono">{reservation.reservation_number}</span>
            <Badge className={statusColors[reservation.status]}>
              {statusLabels[reservation.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Client Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Informations client
          </h4>
          {reservation.guest ? (
            <div className="space-y-2 bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {reservation.guest.first_name} {reservation.guest.last_name}
                </span>
              </div>
              {reservation.guest.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${reservation.guest.email}`} className="text-primary hover:underline">
                    {reservation.guest.email}
                  </a>
                </div>
              )}
              {reservation.guest.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${reservation.guest.phone}`} className="text-primary hover:underline">
                    {reservation.guest.phone}
                  </a>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                {reservation.guest.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${reservation.guest.phone}`}>
                      <Phone className="h-3 w-3 mr-1" />
                      Appeler
                    </a>
                  </Button>
                )}
                {reservation.guest.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${reservation.guest.email}?subject=Réservation ${reservation.reservation_number}`}>
                      <Mail className="h-3 w-3 mr-1" />
                      Envoyer un email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Aucun client associé</p>
          )}
        </div>

        <Separator />

        {/* Séjour */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Détails du séjour
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-xs">Arrivée</p>
                <p className="font-medium">{format(new Date(reservation.check_in_date), "dd MMMM yyyy", { locale: fr })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-xs">Départ</p>
                <p className="font-medium">{format(new Date(reservation.check_out_date), "dd MMMM yyyy", { locale: fr })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-xs">Durée</p>
                <p className="font-medium">{nights} nuit{nights > 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-xs">Personnes</p>
                <p className="font-medium">{reservation.num_guests}</p>
              </div>
            </div>
          </div>
          {reservation.room_type && (
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-xs">Chambre</p>
                <p className="font-medium">{reservation.room_type.name} — {formatPrice(reservation.room_type.base_price)}/nuit</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Tarification */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Tarification
          </h4>
          <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
            {reservation.room_type && (
              <div className="flex justify-between">
                <span>{reservation.room_type.name} × {nights} nuit{nights > 1 ? "s" : ""}</span>
                <span>{formatPrice(reservation.room_type.base_price * nights)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-accent">{reservation.total_price ? formatPrice(reservation.total_price) : "—"}</span>
            </div>
          </div>
        </div>

        {/* Demandes spéciales */}
        {reservation.special_requests && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Demandes spéciales
              </h4>
              <p className="text-sm bg-muted/50 rounded-lg p-4">{reservation.special_requests}</p>
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground text-right">
          Créée le {format(new Date(reservation.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailDialog;
