import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Calendar, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Reservation {
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

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

interface RoomType {
  id: string;
  name: string;
  base_price: number;
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

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    guest_id: "",
    room_type_id: "",
    check_in_date: "",
    check_out_date: "",
    num_guests: 1,
    special_requests: "",
  });

  const fetchData = async () => {
    const [reservationsRes, guestsRes, roomTypesRes] = await Promise.all([
      supabase
        .from("reservations")
        .select(`
          *,
          guest:guests(id, first_name, last_name, email, phone),
          room_type:room_types(name, base_price)
        `)
        .order("created_at", { ascending: false }),
      supabase.from("guests").select("id, first_name, last_name, email, phone").order("last_name"),
      supabase.from("room_types").select("id, name, base_price").order("base_price"),
    ]);

    if (reservationsRes.error) {
      toast({ variant: "destructive", title: "Erreur", description: reservationsRes.error.message });
    } else {
      setReservations(reservationsRes.data || []);
    }

    setGuests(guestsRes.data || []);
    setRoomTypes(roomTypesRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomType = roomTypes.find(rt => rt.id === formData.room_type_id);
    const nights = Math.ceil(
      (new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const totalPrice = roomType ? roomType.base_price * nights : 0;

    const { error } = await supabase.from("reservations").insert({
      guest_id: formData.guest_id,
      room_type_id: formData.room_type_id,
      check_in_date: formData.check_in_date,
      check_out_date: formData.check_out_date,
      num_guests: formData.num_guests,
      special_requests: formData.special_requests || null,
      total_price: totalPrice,
      status: "pending" as const,
      reservation_number: `RES-${Date.now()}`,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Réservation créée" });
      setIsDialogOpen(false);
      setFormData({
        guest_id: "",
        room_type_id: "",
        check_in_date: "",
        check_out_date: "",
        num_guests: 1,
        special_requests: "",
      });
      fetchData();
    }
  };

  const updateStatus = async (id: string, status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled") => {
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Statut mis à jour" });
      fetchData();
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.guest?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.guest?.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Réservations</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Réservations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle réservation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={formData.guest_id} onValueChange={(v) => setFormData({ ...formData, guest_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((guest) => (
                      <SelectItem key={guest.id} value={guest.id}>
                        {guest.first_name} {guest.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type de chambre</Label>
                <Select value={formData.room_type_id} onValueChange={(v) => setFormData({ ...formData, room_type_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name} - {formatPrice(rt.base_price)}/nuit
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in</Label>
                  <Input
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check-out</Label>
                  <Input
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre de personnes</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.num_guests}
                  onChange={(e) => setFormData({ ...formData, num_guests: parseInt(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Créer la réservation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="checked_in">Check-in</SelectItem>
            <SelectItem value="checked_out">Check-out</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune réservation trouvée
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((res) => (
            <Card key={res.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{res.reservation_number}</span>
                      <Badge className={statusColors[res.status]}>
                        {statusLabels[res.status]}
                      </Badge>
                      {res.room_type && (
                        <Badge variant="outline">{res.room_type.name}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {res.guest && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {res.guest.first_name} {res.guest.last_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(res.check_in_date), "dd MMM", { locale: fr })} - {format(new Date(res.check_out_date), "dd MMM yyyy", { locale: fr })}
                      </span>
                      {res.guest?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {res.guest.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {res.total_price && (
                      <span className="font-semibold text-accent">{formatPrice(res.total_price)}</span>
                    )}
                    <Select value={res.status} onValueChange={(v: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled") => updateStatus(res.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="checked_in">Check-in</SelectItem>
                        <SelectItem value="checked_out">Check-out</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Reservations;
