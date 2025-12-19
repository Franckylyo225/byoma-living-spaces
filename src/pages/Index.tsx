import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Residences from "@/components/Residences";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Residences />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
