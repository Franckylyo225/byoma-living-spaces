import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Bed, DoorOpen, Settings } from "lucide-react";
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

interface Room {
  id: string;
  room_number: string;
  room_type_id: string | null;
  floor: number | null;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  notes: string | null;
  room_type?: RoomType;
}

const statusLabels: Record<string, string> = {
  available: "Disponible",
  occupied: "Occupée",
  maintenance: "Maintenance",
  cleaning: "Nettoyage",
};

const statusColors: Record<string, string> = {
  available: "bg-green-500/10 text-green-600 border-green-500/20",
  occupied: "bg-red-500/10 text-red-600 border-red-500/20",
  maintenance: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  cleaning: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const { toast } = useToast();

  const [roomFormData, setRoomFormData] = useState({
    room_number: "",
    room_type_id: "",
    floor: 1,
    status: "available" as Room["status"],
    notes: "",
  });

  const [typeFormData, setTypeFormData] = useState({
    name: "",
    description: "",
    capacity: 2,
    base_price: 0,
    amenities: "",
  });

  const fetchData = async () => {
    const [typesRes, roomsRes] = await Promise.all([
      supabase.from("room_types").select("*").order("base_price", { ascending: true }),
      supabase.from("rooms").select("*, room_type:room_types(*)").order("room_number", { ascending: true }),
    ]);

    if (typesRes.error) {
      toast({ variant: "destructive", title: "Erreur", description: typesRes.error.message });
    } else {
      setRoomTypes(typesRes.data || []);
    }

    if (roomsRes.error) {
      toast({ variant: "destructive", title: "Erreur", description: roomsRes.error.message });
    } else {
      setRooms(roomsRes.data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Room handlers
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomData = {
      room_number: roomFormData.room_number,
      room_type_id: roomFormData.room_type_id || null,
      floor: roomFormData.floor,
      status: roomFormData.status,
      notes: roomFormData.notes || null,
    };

    if (editingRoom) {
      const { error } = await supabase.from("rooms").update(roomData).eq("id", editingRoom.id);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Chambre modifiée" });
        setIsRoomDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("rooms").insert(roomData);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Chambre créée" });
        setIsRoomDialogOpen(false);
        fetchData();
      }
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomFormData({
      room_number: room.room_number,
      room_type_id: room.room_type_id || "",
      floor: room.floor || 1,
      status: room.status,
      notes: room.notes || "",
    });
    setIsRoomDialogOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Chambre supprimée" });
      fetchData();
    }
  };

  const openNewRoomDialog = () => {
    setEditingRoom(null);
    setRoomFormData({
      room_number: "",
      room_type_id: "",
      floor: 1,
      status: "available",
      notes: "",
    });
    setIsRoomDialogOpen(true);
  };

  // Type handlers
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArray = typeFormData.amenities.split(",").map(a => a.trim()).filter(Boolean);
    
    const typeData = {
      name: typeFormData.name,
      description: typeFormData.description,
      capacity: typeFormData.capacity,
      base_price: typeFormData.base_price,
      total_rooms: rooms.filter(r => r.room_type_id === editingType?.id).length || 0,
      amenities: amenitiesArray,
    };

    if (editingType) {
      const { error } = await supabase.from("room_types").update(typeData).eq("id", editingType.id);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Type de chambre modifié" });
        setIsTypeDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("room_types").insert(typeData);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Succès", description: "Type de chambre créé" });
        setIsTypeDialogOpen(false);
        fetchData();
      }
    }
  };

  const getAmenitiesArray = (amenities: unknown): string[] => {
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === 'string') return amenities.split(',').map(a => a.trim());
    return [];
  };

  const handleEditType = (type: RoomType) => {
    setEditingType(type);
    const amenitiesArray = getAmenitiesArray(type.amenities);
    setTypeFormData({
      name: type.name,
      description: type.description || "",
      capacity: type.capacity,
      base_price: type.base_price,
      amenities: amenitiesArray.join(", "),
    });
    setIsTypeDialogOpen(true);
  };

  const handleDeleteType = async (id: string) => {
    const roomsUsingType = rooms.filter(r => r.room_type_id === id);
    if (roomsUsingType.length > 0) {
      toast({ 
        variant: "destructive", 
        title: "Impossible de supprimer", 
        description: `Ce type est utilisé par ${roomsUsingType.length} chambre(s)` 
      });
      return;
    }
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce type de chambre ?")) return;
    const { error } = await supabase.from("room_types").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Type de chambre supprimé" });
      fetchData();
    }
  };

  const openNewTypeDialog = () => {
    setEditingType(null);
    setTypeFormData({
      name: "",
      description: "",
      capacity: 2,
      base_price: 0,
      amenities: "",
    });
    setIsTypeDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const getRoomCountByType = (typeId: string) => {
    return rooms.filter(r => r.room_type_id === typeId).length;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Gestion des Chambres</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      <h1 className="font-display text-3xl">Gestion des Chambres</h1>

      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            Chambres ({rooms.length})
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Types ({roomTypes.length})
          </TabsTrigger>
        </TabsList>

        {/* Chambres individuelles */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewRoomDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une chambre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingRoom ? "Modifier la chambre" : "Nouvelle chambre"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRoomSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room_number">Numéro / Nom de la chambre</Label>
                    <Input
                      id="room_number"
                      value={roomFormData.room_number}
                      onChange={(e) => setRoomFormData({ ...roomFormData, room_number: e.target.value })}
                      placeholder="Ex: 101, Suite Royale..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room_type">Type de chambre</Label>
                    <Select 
                      value={roomFormData.room_type_id} 
                      onValueChange={(v) => setRoomFormData({ ...roomFormData, room_type_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - {formatPrice(type.base_price)}/nuit
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="floor">Étage</Label>
                      <Input
                        id="floor"
                        type="number"
                        min="0"
                        value={roomFormData.floor}
                        onChange={(e) => setRoomFormData({ ...roomFormData, floor: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select 
                        value={roomFormData.status} 
                        onValueChange={(v: Room["status"]) => setRoomFormData({ ...roomFormData, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="occupied">Occupée</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="cleaning">Nettoyage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={roomFormData.notes}
                      onChange={(e) => setRoomFormData({ ...roomFormData, notes: e.target.value })}
                      placeholder="Notes internes sur cette chambre..."
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

          {rooms.length === 0 ? (
            <Card className="p-12 text-center">
              <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucune chambre</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos chambres individuellement
              </p>
              <Button onClick={openNewRoomDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une chambre
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Bed className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{room.room_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Étage {room.floor || 1}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={statusColors[room.status]}>
                        {statusLabels[room.status]}
                      </Badge>
                      {room.room_type && (
                        <Badge variant="secondary">{room.room_type.name}</Badge>
                      )}
                    </div>
                    {room.room_type && (
                      <div className="text-right">
                        <span className="font-semibold text-accent">
                          {formatPrice(room.room_type.base_price)}/nuit
                        </span>
                      </div>
                    )}
                    {room.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 border-t pt-2">
                        {room.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Types de chambres */}
        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewTypeDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingType ? "Modifier le type" : "Nouveau type de chambre"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTypeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_name">Nom du type</Label>
                    <Input
                      id="type_name"
                      value={typeFormData.name}
                      onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                      placeholder="Ex: Standard, Premium, Suite..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type_description">Description</Label>
                    <Textarea
                      id="type_description"
                      value={typeFormData.description}
                      onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type_capacity">Capacité (pers.)</Label>
                      <Input
                        id="type_capacity"
                        type="number"
                        min="1"
                        value={typeFormData.capacity}
                        onChange={(e) => setTypeFormData({ ...typeFormData, capacity: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type_price">Prix/nuit (FCFA)</Label>
                      <Input
                        id="type_price"
                        type="number"
                        min="0"
                        value={typeFormData.base_price}
                        onChange={(e) => setTypeFormData({ ...typeFormData, base_price: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type_amenities">Équipements (séparés par virgules)</Label>
                    <Textarea
                      id="type_amenities"
                      value={typeFormData.amenities}
                      onChange={(e) => setTypeFormData({ ...typeFormData, amenities: e.target.value })}
                      placeholder="WiFi, Climatisation, TV, Mini-bar..."
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingType ? "Modifier" : "Créer"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {roomTypes.length === 0 ? (
            <Card className="p-12 text-center">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucun type de chambre</h3>
              <p className="text-muted-foreground mb-4">
                Créez d'abord vos types (Standard, Premium, Suite)
              </p>
              <Button onClick={openNewTypeDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un type
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((type) => (
                <Card key={type.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Bed className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {getRoomCountByType(type.id)} chambre(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditType(type)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteType(type.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {type.description || "Aucune description"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const amenities = getAmenitiesArray(type.amenities);
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
                      <span className="text-sm text-muted-foreground">Capacité: {type.capacity} pers.</span>
                      <span className="font-semibold text-accent">{formatPrice(type.base_price)}/nuit</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rooms;
