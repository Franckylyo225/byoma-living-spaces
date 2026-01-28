import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Residences from "@/components/Residences";
import RestaurantSection from "@/components/RestaurantSection";
import SpectacleSection from "@/components/SpectacleSection";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Hero />
      <About />
      <Residences />
      <RestaurantSection />
      <SpectacleSection />
      <Experience />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
