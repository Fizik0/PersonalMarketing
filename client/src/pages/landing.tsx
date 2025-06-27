import { useEffect } from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/sections/hero";
import ExpertiseSection from "@/components/sections/expertise";
import AboutSection from "@/components/sections/about";
import ServicesSection from "@/components/sections/services";
import BlogPreviewSection from "@/components/sections/blog-preview";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/layout/footer";

export default function Landing() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <HeroSection />
        <ExpertiseSection />
        <AboutSection />
        <ServicesSection />
        <BlogPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
