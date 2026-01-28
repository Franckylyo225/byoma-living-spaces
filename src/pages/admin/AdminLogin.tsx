import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import logoDark from "@/assets/logo-byoma-dark.png";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Gérez votre établissement",
    subtitle: "avec élégance et efficacité",
  },
  {
    image: heroSlide2,
    title: "Une expérience",
    subtitle: "d'hospitalité exceptionnelle",
  },
  {
    image: heroSlide3,
    title: "Simplifiez vos opérations",
    subtitle: "au quotidien",
  },
];

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, department")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (profile) {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans l'espace administrateur",
          });
          navigate("/admin");
        } else {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions nécessaires",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          full_name: fullName,
          role: "admin" as const,
        });

        if (profileError) throw profileError;

        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "admin" as const,
        });

        if (roleError) throw roleError;

        toast({
          title: "Inscription réussie",
          description: "Votre compte administrateur a été créé. Vous pouvez maintenant vous connecter.",
        });
        
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          </div>
        ))}
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          <img src={logoDark} alt="BYOMA" className="h-20 w-auto drop-shadow-lg" />
          
          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute"
                }`}
              >
                {index === currentSlide && (
                  <>
                    <h1 className="font-display text-4xl xl:text-5xl text-foreground leading-tight">
                      {slide.title}
                    </h1>
                    <p className="font-display text-3xl xl:text-4xl text-accent">
                      {slide.subtitle}
                    </p>
                  </>
                )}
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="flex gap-2 pt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-accent"
                      : "w-4 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BYOMA. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-card">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logoDark} alt="BYOMA" className="h-16" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl text-foreground">
              {isSignUp ? "Créer un compte" : "Bienvenue"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Inscrivez-vous pour créer un compte administrateur"
                : "Connectez-vous à votre espace de gestion"
              }
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-11 h-12 bg-background border-border focus:border-accent focus:ring-accent"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@byoma.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-background border-border focus:border-accent focus:ring-accent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-background border-border focus:border-accent focus:ring-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 bg-background border-border focus:border-accent focus:ring-accent"
                    required
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? "Inscription..." : "Connexion...") 
                : (isSignUp ? "S'inscrire" : "Se connecter")
              }
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">ou</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                resetForm();
              }}
              className="text-foreground hover:text-accent transition-colors"
            >
              {isSignUp 
                ? <>Déjà un compte ? <span className="text-accent font-medium">Se connecter</span></>
                : <>Pas encore de compte ? <span className="text-accent font-medium">S'inscrire</span></>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
