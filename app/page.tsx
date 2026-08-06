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
import { businessSection, contactsSection } from "@/content";

export default function Home() {
  return (
    <>
      <Header />
      <MobileMenu />
      <Hero />
      <ForWhom />

      {/* У цифрах + Для бізнесу — спільне розмите фото-тло, як у прототипі */}
      <div className="relative overflow-hidden">
        <div className="hero-bg hero-dim-50">
          <img loading="lazy" src={`/assets/${businessSection.bgImg}`} alt="" />
        </div>
        <div className="hero-overlay"></div>
        <Stats />
        <BusinessSection />
      </div>

      <HomeSection />
      <CatalogSection />
      <ServiceAndDelivery />
      <AboutSection />
      <WarrantyAndSteps />
      <FaqSection />

      {/* Контакти + Футер — спільне розмите фото-тло, як у прототипі */}
      <div className="relative overflow-hidden">
        <div className="hero-bg hero-dim-40">
          <img loading="lazy" src={`/assets/${contactsSection.bgImg}`} alt="" />
        </div>
        <div className="hero-overlay"></div>
        <ContactsSection />
        <Footer />
      </div>

      <BackToTop />
      <ViberFloating />
      <Lightbox />
      <SiteScripts />
    </>
  );
}
