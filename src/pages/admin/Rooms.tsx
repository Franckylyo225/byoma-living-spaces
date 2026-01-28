import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Bed } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 2,
    base_price: 0,
    total_rooms: 1,
    amenities: "",
  });

  const fetchRoomTypes = async () => {
    const { data, error } = await supabase
      .from("room_types")
      .select("*")
      .order("base_price", { ascending: true });

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setRoomTypes(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amenitiesArray = formData.amenities.split(",").map(a => a.trim()).filter(Boolean);
    
    const roomData = {
      name: formData.name,
      description: formData.description,
      capacity: formData.capacity,
      base_price: formData.base_price,
      total_rooms: formData.total_rooms,
      amenities: amenitiesArray,
    };

    if (editingRoom) {
      const { error } = await supabase
        .from("room_types")
        .update(roomData)
        .eq("id", editingRoom.id);

      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Type de chambre modifié" });
        setIsDialogOpen(false);
        fetchRoomTypes();
      }
    } else {
      const { error } = await supabase.from("room_types").insert(roomData);

      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Type de chambre créé" });
        setIsDialogOpen(false);
        fetchRoomTypes();
      }
    }
  };

  const getAmenitiesArray = (amenities: unknown): string[] => {
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === 'string') return amenities.split(',').map(a => a.trim());
    return [];
  };

  const handleEdit = (room: RoomType) => {
    setEditingRoom(room);
    const amenitiesArray = getAmenitiesArray(room.amenities);
    setFormData({
      name: room.name,
      description: room.description || "",
      capacity: room.capacity,
      base_price: room.base_price,
      total_rooms: room.total_rooms,
      amenities: amenitiesArray.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce type de chambre ?")) return;

    const { error } = await supabase.from("room_types").delete().eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Type de chambre supprimé" });
      fetchRoomTypes();
    }
  };

  const openNewDialog = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      description: "",
      capacity: 2,
      base_price: 0,
      total_rooms: 1,
      amenities: "",
    });
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Gestion des Chambres</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
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
        <h1 className="font-display text-3xl">Gestion des Chambres</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "Modifier le type de chambre" : "Nouveau type de chambre"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_rooms">Nombre de chambres</Label>
                  <Input
                    id="total_rooms"
                    type="number"
                    min="1"
                    value={formData.total_rooms}
                    onChange={(e) => setFormData({ ...formData, total_rooms: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price">Prix par nuit (FCFA)</Label>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Équipements (séparés par des virgules)</Label>
                <Textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, Climatisation, TV, Mini-bar..."
                  rows={2}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingRoom ? "Modifier" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Bed className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {room.total_rooms} chambre{room.total_rooms > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const amenities = getAmenitiesArray(room.amenities);
                  return (
                    <>
                      {amenities.slice(0, 4).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{amenities.length - 4}
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Capacité: {room.capacity} pers.</span>
                <span className="font-semibold text-accent">{formatPrice(room.base_price)}/nuit</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
