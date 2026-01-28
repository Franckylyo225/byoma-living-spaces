import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Bed, 
  CalendarDays, 
  UtensilsCrossed, 
  Theater, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoDark from "@/assets/logo-byoma-dark.png";

interface Profile {
  full_name: string | null;
  role: string;
  department: string | null;
}

const AdminLayout = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, role, department")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!profileData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setProfile(profileData);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isAdmin = profile?.role === "admin";
  const department = profile?.department;

  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin", show: true },
    { icon: Bed, label: "Chambres", path: "/admin/rooms", show: isAdmin || department === "reception" },
    { icon: CalendarDays, label: "Réservations", path: "/admin/reservations", show: isAdmin || department === "reception" },
    { icon: UtensilsCrossed, label: "Restaurant", path: "/admin/restaurant", show: isAdmin || department === "restaurant" },
    { icon: Theater, label: "Événements", path: "/admin/events", show: isAdmin || department === "events" },
    { icon: Users, label: "Clients", path: "/admin/guests", show: isAdmin || department === "reception" },
    { icon: MessageSquare, label: "Messages", path: "/admin/messages", show: true },
    { icon: Settings, label: "Paramètres", path: "/admin/settings", show: isAdmin },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <img src={logoDark} alt="BYOMA" className="h-8" />
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center h-16 px-6 border-b">
            <img src={logoDark} alt="BYOMA" className="h-8" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 mt-16 lg:mt-0">
            <ul className="space-y-1 px-3">
              {navItems.filter(item => item.show).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="mb-3 px-3">
              <p className="font-medium text-sm truncate">{profile?.full_name || "Utilisateur"}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role === "admin" ? "Administrateur" : profile?.department}
              </p>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
