import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar, Users, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  ticket_price: number | null;
  capacity: number;
  tickets_sold: number;
  is_public: boolean;
  status: string;
  venue: {
    name: string;
  } | null;
}

interface Venue {
  id: string;
  name: string;
  capacity: number;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue_id: "",
    event_date: "",
    start_time: "",
    end_time: "",
    ticket_price: 0,
    capacity: 100,
    is_public: true,
  });

  const fetchData = async () => {
    const [eventsRes, venuesRes] = await Promise.all([
      supabase
        .from("events")
        .select("*, venue:venues(name)")
        .order("event_date", { ascending: true }),
      supabase.from("venues").select("id, name, capacity").eq("is_active", true),
    ]);

    if (eventsRes.error) {
      toast({ variant: "destructive", title: "Erreur", description: eventsRes.error.message });
    } else {
      setEvents(eventsRes.data || []);
    }

    setVenues(venuesRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      name: formData.name,
      description: formData.description || null,
      venue_id: formData.venue_id || null,
      event_date: formData.event_date,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      ticket_price: formData.ticket_price || null,
      capacity: formData.capacity,
      is_public: formData.is_public,
      status: "pending" as const,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", editingEvent.id);

      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Événement modifié" });
        setIsDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("events").insert(eventData);

      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Événement créé" });
        setIsDialogOpen(false);
        fetchData();
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || "",
      venue_id: "",
      event_date: event.event_date,
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      ticket_price: event.ticket_price || 0,
      capacity: event.capacity,
      is_public: event.is_public,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Événement supprimé" });
      fetchData();
    }
  };

  const updateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Statut mis à jour" });
      fetchData();
    }
  };

  const openNewDialog = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      description: "",
      venue_id: "",
      event_date: "",
      start_time: "",
      end_time: "",
      ticket_price: 0,
      capacity: 100,
      is_public: true,
    });
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Événements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Événements</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Salle</Label>
                <Select value={formData.venue_id} onValueChange={(v) => setFormData({ ...formData, venue_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une salle" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name} ({venue.capacity} places)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure début</Label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure fin</Label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prix du ticket (FCFA)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.ticket_price}
                  onChange={(e) => setFormData({ ...formData, ticket_price: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Événement public</Label>
                <Switch
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingEvent ? "Modifier" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun événement programmé
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={statusColors[event.status]}>
                        {statusLabels[event.status]}
                      </Badge>
                      {!event.is_public && (
                        <Badge variant="outline">Privé</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.event_date), "dd MMMM yyyy", { locale: fr })}
                  </span>
                  {event.start_time && (
                    <span className="text-muted-foreground">à {event.start_time.slice(0, 5)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.tickets_sold}/{event.capacity}
                  </span>
                  {event.ticket_price && (
                    <span className="flex items-center gap-1 font-medium text-accent">
                      <Ticket className="h-4 w-4" />
                      {formatPrice(event.ticket_price)}
                    </span>
                  )}
                </div>
                <Select value={event.status} onValueChange={(v: "pending" | "confirmed" | "cancelled") => updateStatus(event.id, v)}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
