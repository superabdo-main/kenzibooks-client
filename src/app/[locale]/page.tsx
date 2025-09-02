import React from "react";
import { Navigation } from "../../components/landing/Navigation";
import { HeroSection } from "../../components/landing/HeroSection";
import  KeyDifferentiators  from "../../components/landing/KeyDifferentiators";
import  {FeatureHighlights}  from "../../components/landing/FeatureHighlights";
import { EducationalResources } from "../../components/landing/EducationalResources";
import { PricingPlans } from "../../components/landing/PricingPlans";
import { FAQSection } from "../../components/landing/FAQSection";
import { Footer } from "../../components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <KeyDifferentiators />
      <FeatureHighlights />
      <EducationalResources />
      <PricingPlans />
      <FAQSection />
      <Footer/>
    </div>
  );
}
