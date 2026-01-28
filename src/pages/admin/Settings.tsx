import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
  department: string | null;
  created_at: string;
}

const departmentLabels: Record<string, string> = {
  reception: "Réception",
  restaurant: "Restaurant",
  events: "Événements",
};

const Settings = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "employee" as "admin" | "employee",
    department: "" as string,
  });

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setProfiles(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          full_name: formData.full_name,
          role: formData.role as "admin" | "employee",
          department: formData.role === "employee" && formData.department 
            ? formData.department as "reception" | "restaurant" | "events" 
            : null,
        });

        if (profileError) throw profileError;

        // Create user role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: formData.role,
        });

        if (roleError) throw roleError;

        toast({ title: "Succès", description: "Utilisateur créé" });
        setIsDialogOpen(false);
        setFormData({
          email: "",
          password: "",
          full_name: "",
          role: "employee",
          department: "",
        });
        fetchProfiles();
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProfile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        role: formData.role as "admin" | "employee",
        department: formData.role === "employee" && formData.department 
          ? formData.department as "reception" | "restaurant" | "events" 
          : null,
      })
      .eq("id", editingProfile.id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      // Update user role
      await supabase
        .from("user_roles")
        .upsert({
          user_id: editingProfile.user_id,
          role: formData.role,
        });

      toast({ title: "Succès", description: "Profil modifié" });
      setIsDialogOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    }
  };

  const handleDelete = async (profile: Profile) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    // Note: This will cascade delete the profile due to FK constraint
    const { error } = await supabase.from("profiles").delete().eq("id", profile.id);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Succès", description: "Utilisateur supprimé" });
      fetchProfiles();
    }
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      email: "",
      password: "",
      full_name: profile.full_name || "",
      role: profile.role as "admin" | "employee",
      department: profile.department || "",
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingProfile(null);
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "employee",
      department: "",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Paramètres</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Paramètres</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les comptes administrateurs et employés
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProfile ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={editingProfile ? handleUpdateProfile : handleCreateUser} className="space-y-4">
                  {!editingProfile && (
                    <>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mot de passe</Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rôle</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(v: "admin" | "employee") => setFormData({ ...formData, role: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="employee">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.role === "employee" && (
                    <div className="space-y-2">
                      <Label>Département</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(v) => setFormData({ ...formData, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reception">Réception</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="events">Événements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    {editingProfile ? "Modifier" : "Créer"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </p>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${profile.role === "admin" ? "bg-accent/20" : "bg-muted"}`}>
                      {profile.role === "admin" ? (
                        <Shield className="h-4 w-4 text-accent" />
                      ) : (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{profile.full_name || "Sans nom"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                          {profile.role === "admin" ? "Admin" : "Employé"}
                        </Badge>
                        {profile.department && (
                          <Badge variant="outline">
                            {departmentLabels[profile.department] || profile.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(profile)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(profile)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
