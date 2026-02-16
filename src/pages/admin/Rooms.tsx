import { useEffect, useState, useMemo, useRef } from "react";
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
import { Plus, Edit, Trash2, Bed, DoorOpen, Settings, Filter, X, LayoutGrid, List, ArrowUpDown, ArrowUp, ArrowDown, ImageIcon, Eye, Users, AlertCircle, Upload, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RoomTypeImage {
  id: string;
  room_type_id: string;
  image_url: string;
  display_order: number;
  caption: string | null;
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
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortColumn, setSortColumn] = useState<string>("room_number");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [typeImages, setTypeImages] = useState<RoomTypeImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    image_url: "",
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

  const handleQuickStatusChange = async (roomId: string, newStatus: Room["status"]) => {
    const { error } = await supabase.from("rooms").update({ status: newStatus }).eq("id", roomId);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Statut mis à jour", description: `Chambre passée en "${statusLabels[newStatus]}"` });
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
      image_url: typeFormData.image_url || null,
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

  const handleEditType = async (type: RoomType) => {
    setEditingType(type);
    const amenitiesArray = getAmenitiesArray(type.amenities);
    setTypeFormData({
      name: type.name,
      description: type.description || "",
      capacity: type.capacity,
      base_price: type.base_price,
      amenities: amenitiesArray.join(", "),
      image_url: type.image_url || "",
    });
    // Fetch images for this type
    const { data } = await supabase
      .from("room_type_images")
      .select("*")
      .eq("room_type_id", type.id)
      .order("display_order", { ascending: true });
    setTypeImages(data || []);
    setNewImageUrl("");
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
      image_url: "",
    });
    setTypeImages([]);
    setNewImageUrl("");
    setIsTypeDialogOpen(true);
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim() || !editingType) return;
    const maxOrder = typeImages.length > 0 ? Math.max(...typeImages.map(i => i.display_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("room_type_images")
      .insert({
        room_type_id: editingType.id,
        image_url: newImageUrl.trim(),
        display_order: maxOrder,
      })
      .select()
      .single();
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else if (data) {
      setTypeImages([...typeImages, data]);
      setNewImageUrl("");
      // Set as main image if first one
      if (typeImages.length === 0) {
        await supabase.from("room_types").update({ image_url: newImageUrl.trim() }).eq("id", editingType.id);
        setTypeFormData({ ...typeFormData, image_url: newImageUrl.trim() });
      }
      toast({ title: "Image ajoutée" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingType) return;
    setIsUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${editingType.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) {
        toast({ variant: "destructive", title: "Erreur d'upload", description: uploadError.message });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("room-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      const maxOrder = typeImages.length > 0 ? Math.max(...typeImages.map(i => i.display_order)) + 1 : 0;

      const { data, error } = await supabase
        .from("room_type_images")
        .insert({
          room_type_id: editingType.id,
          image_url: publicUrl,
          display_order: maxOrder + Array.from(files).indexOf(file),
        })
        .select()
        .single();

      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else if (data) {
        setTypeImages(prev => [...prev, data]);
        // Set as main image if first one
        if (typeImages.length === 0 && Array.from(files).indexOf(file) === 0) {
          await supabase.from("room_types").update({ image_url: publicUrl }).eq("id", editingType.id);
          setTypeFormData(prev => ({ ...prev, image_url: publicUrl }));
        }
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast({ title: "Upload terminé" });
    fetchData();
  };

  const handleReorderImages = async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const reordered = [...typeImages];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setTypeImages(reordered);

    // Persist new order
    const updates = reordered.map((img, i) =>
      supabase.from("room_type_images").update({ display_order: i }).eq("id", img.id)
    );
    await Promise.all(updates);

    // Update main image if first changed
    if (editingType && reordered[0]) {
      await supabase.from("room_types").update({ image_url: reordered[0].image_url }).eq("id", editingType.id);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const { error } = await supabase.from("room_type_images").delete().eq("id", imageId);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      const remaining = typeImages.filter(i => i.id !== imageId);
      setTypeImages(remaining);
      // Update main image_url if needed
      if (editingType) {
        const newMainUrl = remaining.length > 0 ? remaining[0].image_url : null;
        await supabase.from("room_types").update({ image_url: newMainUrl }).eq("id", editingType.id);
        setTypeFormData({ ...typeFormData, image_url: newMainUrl || "" });
        fetchData();
      }
      toast({ title: "Image supprimée" });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatFloor = (floor: number | null) => {
    if (floor === 0) return "RDC";
    return `Étage ${floor || 1}`;
  };

  const getRoomCountByType = (typeId: string) => {
    return rooms.filter(r => r.room_type_id === typeId).length;
  };

  // Filtered and sorted rooms
  const filteredRooms = useMemo(() => {
    let result = rooms.filter(room => {
      const matchesType = filterType === "all" || room.room_type_id === filterType;
      const matchesStatus = filterStatus === "all" || room.status === filterStatus;
      return matchesType && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case "room_number":
          comparison = a.room_number.localeCompare(b.room_number, undefined, { numeric: true });
          break;
        case "type":
          const typeA = a.room_type?.name || "";
          const typeB = b.room_type?.name || "";
          comparison = typeA.localeCompare(typeB);
          break;
        case "floor":
          comparison = (a.floor || 0) - (b.floor || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "price":
          const priceA = a.room_type?.base_price || 0;
          const priceB = b.room_type?.base_price || 0;
          comparison = priceA - priceB;
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [rooms, filterType, filterStatus, sortColumn, sortDirection]);

  const hasActiveFilters = filterType !== "all" || filterStatus !== "all";

  const clearFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
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
          {/* Filtres et contrôles */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="occupied">Occupée</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Nettoyage</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                  <X className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {filteredRooms.length} chambre{filteredRooms.length > 1 ? "s" : ""} 
                {hasActiveFilters && ` sur ${rooms.length}`}
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "grid" | "table")}>
                <ToggleGroupItem value="grid" aria-label="Vue grille">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Vue tableau">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
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
                      <Select 
                        value={roomFormData.floor.toString()} 
                        onValueChange={(v) => setRoomFormData({ ...roomFormData, floor: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un étage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Rez-de-chaussée</SelectItem>
                          <SelectItem value="1">1er étage</SelectItem>
                          <SelectItem value="2">2ème étage</SelectItem>
                          <SelectItem value="3">3ème étage</SelectItem>
                          <SelectItem value="4">4ème étage</SelectItem>
                        </SelectContent>
                      </Select>
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
          ) : filteredRooms.length === 0 ? (
            <Card className="p-8 text-center">
              <Filter className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-2">Aucune chambre trouvée</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Aucune chambre ne correspond aux filtres sélectionnés
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
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
                            {formatFloor(room.floor)}
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
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("room_number")}
                    >
                      <div className="flex items-center">
                        Chambre
                        <SortIcon column="room_number" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type
                        <SortIcon column="type" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("floor")}
                    >
                      <div className="flex items-center">
                        Étage
                        <SortIcon column="floor" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Statut
                        <SortIcon column="status" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center justify-end">
                        Prix/nuit
                        <SortIcon column="price" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-accent" />
                          {room.room_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        {room.room_type ? (
                          <Badge variant="secondary">{room.room_type.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{room.floor === 0 ? "RDC" : room.floor || 1}</TableCell>
                      <TableCell>
                        <Select 
                          value={room.status} 
                          onValueChange={(v) => handleQuickStatusChange(room.id, v as Room["status"])}
                        >
                          <SelectTrigger className={`w-[140px] h-8 text-xs ${statusColors[room.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">
                              <span className="text-green-600">Disponible</span>
                            </SelectItem>
                            <SelectItem value="occupied">
                              <span className="text-red-600">Occupée</span>
                            </SelectItem>
                            <SelectItem value="maintenance">
                              <span className="text-yellow-600">Maintenance</span>
                            </SelectItem>
                            <SelectItem value="cleaning">
                              <span className="text-blue-600">Nettoyage</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-accent">
                        {room.room_type ? formatPrice(room.room_type.base_price) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Types de chambres */}
        <TabsContent value="types" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Configuration des types</h2>
              <p className="text-sm text-muted-foreground">Gérez les catégories affichées sur le site public</p>
            </div>
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewTypeDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {editingType ? "Modifier le type de chambre" : "Nouveau type de chambre"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTypeSubmit}>
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="info" className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Informations
                      </TabsTrigger>
                      <TabsTrigger value="images" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Images
                        {!typeFormData.image_url && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 ml-1">!</Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    {/* Onglet Informations */}
                    <TabsContent value="info" className="space-y-5 mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="type_capacity">Capacité</Label>
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type_description">Description</Label>
                        <Textarea
                          id="type_description"
                          value={typeFormData.description}
                          onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                          placeholder="Description affichée sur le site public..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type_amenities">Équipements (séparés par virgules)</Label>
                        <Textarea
                          id="type_amenities"
                          value={typeFormData.amenities}
                          onChange={(e) => setTypeFormData({ ...typeFormData, amenities: e.target.value })}
                          placeholder="WiFi, Climatisation, TV écran plat, Mini-bar, Coffre-fort..."
                          rows={3}
                        />
                        {typeFormData.amenities && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {typeFormData.amenities.split(",").map((a, i) => a.trim()).filter(Boolean).map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Onglet Images */}
                    <TabsContent value="images" className="space-y-5 mt-0">
                      {!editingType ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">Créez d'abord le type, puis ajoutez des images en le modifiant.</p>
                        </div>
                      ) : (
                        <>
                          {/* Galerie d'images existantes */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Photos de la chambre ({typeImages.length})</Label>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {Array.from({ length: 10 }).map((_, idx) => {
                                const img = typeImages[idx];
                                return (
                                  <div
                                    key={idx}
                                    className={`relative group rounded-lg overflow-hidden border bg-muted aspect-square transition-all ${
                                      img ? "cursor-grab active:cursor-grabbing" : ""
                                    } ${dragIdx !== null && idx < typeImages.length && dragIdx !== idx ? "ring-2 ring-accent/40" : ""} ${
                                      dragIdx === idx ? "opacity-40 scale-95" : ""
                                    }`}
                                    draggable={!!img}
                                    onDragStart={(e) => {
                                      if (!img) { e.preventDefault(); return; }
                                      setDragIdx(idx);
                                      e.dataTransfer.effectAllowed = "move";
                                    }}
                                    onDragOver={(e) => {
                                      if (dragIdx === null || idx >= typeImages.length) return;
                                      e.preventDefault();
                                      e.dataTransfer.dropEffect = "move";
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      if (dragIdx !== null && idx < typeImages.length) {
                                        handleReorderImages(dragIdx, idx);
                                      }
                                      setDragIdx(null);
                                    }}
                                    onDragEnd={() => setDragIdx(null)}
                                  >
                                    {img ? (
                                      <>
                                        <img 
                                          src={img.image_url} 
                                          alt={`Photo ${idx + 1}`} 
                                          className="w-full h-full object-cover pointer-events-none"
                                          onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                                        />
                                        {idx === 0 && (
                                          <Badge className="absolute top-1 left-1 bg-accent text-accent-foreground text-[9px] px-1 py-0">
                                            1ère
                                          </Badge>
                                        )}
                                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 text-[10px] px-2"
                                            onClick={() => handleDeleteImage(img.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Ajouter des images */}
                          <div className="space-y-3 pt-3 border-t">
                            <Label>Ajouter des photos</Label>
                            
                            {/* Upload button */}
                            <div className="flex gap-2">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="default"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex-1"
                              >
                                {isUploading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Upload en cours...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Uploader des photos
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Or paste URL */}
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">ou coller une URL</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://exemple.com/photo-chambre.jpg"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddImage}
                                disabled={!newImageUrl.trim()}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              La première image sera utilisée comme photo principale sur le site.
                              Vous pouvez sélectionner plusieurs fichiers à la fois.
                            </p>
                          </div>

                        </>
                      )}
                    </TabsContent>
                  </Tabs>

                  <Button type="submit" className="w-full mt-6">
                    {editingType ? "Enregistrer les modifications" : "Créer le type"}
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
              {roomTypes.map((type) => {
                const roomCount = getRoomCountByType(type.id);
                const amenities = getAmenitiesArray(type.amenities);
                return (
                  <Card key={type.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {/* Photo section */}
                    <div className="relative h-48 bg-muted">
                      {type.image_url ? (
                        <img 
                          src={type.image_url} 
                          alt={type.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 bg-muted/80">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">Aucune photo</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleEditType(type)}
                          >
                            Ajouter une photo
                          </Button>
                        </div>
                      )}
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                          {roomCount} chambre{roomCount > 1 ? "s" : ""}
                        </Badge>
                      </div>
                      {!type.image_url && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Photo manquante
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{type.name}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Users className="h-3.5 w-3.5" />
                            Jusqu'à {type.capacity} personne{type.capacity > 1 ? "s" : ""}
                          </p>
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
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {type.description || "Aucune description — cliquez sur Modifier pour en ajouter une"}
                      </p>
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {amenities.slice(0, 5).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {amenities.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{amenities.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-2xl font-bold text-accent">
                          {formatPrice(type.base_price)}
                        </span>
                        <span className="text-sm text-muted-foreground">/ nuit</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rooms;
