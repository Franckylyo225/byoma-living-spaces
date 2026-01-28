import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, CalendarDays, Users, MessageSquare, TrendingUp, Theater } from "lucide-react";

interface Stats {
  totalRooms: number;
  availableRooms: number;
  pendingReservations: number;
  todayCheckins: number;
  totalGuests: number;
  unreadMessages: number;
  upcomingEvents: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0,
    availableRooms: 0,
    pendingReservations: 0,
    todayCheckins: 0,
    totalGuests: 0,
    unreadMessages: 0,
    upcomingEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];

      const [
        roomTypesRes,
        reservationsRes,
        guestsRes,
        messagesRes,
        eventsRes,
      ] = await Promise.all([
        supabase.from("room_types").select("total_rooms"),
        supabase.from("reservations").select("status, check_in_date"),
        supabase.from("guests").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("event_date", today),
      ]);

      const totalRooms = roomTypesRes.data?.reduce((sum, rt) => sum + (rt.total_rooms || 0), 0) || 0;
      const reservations = reservationsRes.data || [];
      const pendingReservations = reservations.filter(r => r.status === "pending").length;
      const todayCheckins = reservations.filter(r => r.check_in_date === today && r.status === "confirmed").length;

      setStats({
        totalRooms,
        availableRooms: totalRooms, // Will be calculated based on actual room assignments
        pendingReservations,
        todayCheckins,
        totalGuests: guestsRes.count || 0,
        unreadMessages: messagesRes.count || 0,
        upcomingEvents: eventsRes.count || 0,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Chambres Totales",
      value: stats.totalRooms,
      icon: Bed,
      description: `${stats.availableRooms} disponibles`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Réservations en attente",
      value: stats.pendingReservations,
      icon: CalendarDays,
      description: `${stats.todayCheckins} arrivées aujourd'hui`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Clients enregistrés",
      value: stats.totalGuests,
      icon: Users,
      description: "Total des clients",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Messages non lus",
      value: stats.unreadMessages,
      icon: MessageSquare,
      description: "À traiter",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Événements à venir",
      value: stats.upcomingEvents,
      icon: Theater,
      description: "Programmés",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-20" />
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
        <h1 className="font-display text-3xl">Tableau de bord</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Mis à jour en temps réel</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a href="/admin/reservations" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <CalendarDays className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Nouvelle réservation</span>
            </a>
            <a href="/admin/guests" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Users className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Ajouter un client</span>
            </a>
            <a href="/admin/events" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Theater className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Créer un événement</span>
            </a>
            <a href="/admin/messages" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <MessageSquare className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Voir les messages</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Les activités récentes apparaîtront ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
