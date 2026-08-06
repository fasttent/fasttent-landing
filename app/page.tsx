import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import Hero from "@/components/Hero";
import ForWhom from "@/components/ForWhom";
import Stats from "@/components/Stats";
import BusinessSection from "@/components/BusinessSection";
import HomeSection from "@/components/HomeSection";
import CatalogSection from "@/components/CatalogSection";
import ServiceAndDelivery from "@/components/ServiceAndDelivery";
import AboutSection from "@/components/AboutSection";
import WarrantyAndSteps from "@/components/WarrantyAndSteps";
import FaqSection from "@/components/FaqSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";
import { BackToTop, ViberFloating } from "@/components/BackToTop";
import Lightbox from "@/components/Lightbox";
import SiteScripts from "@/components/SiteScripts";

export default function Home() {
  return (
    <>
      <Header />
      <MobileMenu />
      <Hero />
      <ForWhom />
      <Stats />
      <BusinessSection />
      <HomeSection />
      <CatalogSection />
      <ServiceAndDelivery />
      <AboutSection />
      <WarrantyAndSteps />
      <FaqSection />
      <ContactsSection />
      <Footer />
      <BackToTop />
      <ViberFloating />
      <Lightbox />
      <SiteScripts />
    </>
  );
}
