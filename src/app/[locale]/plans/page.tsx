
import { Metadata } from "next";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plans & Pricing | Kinzi",
  description: "Choose the perfect plan for your business needs with our flexible pricing options.",
};

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find the Perfect Plan for Your Business
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            All plans include a 30-days free trial. No credit card required to get started.
          </p>
        </div>
      </div>
    

      {/* Pricing plans */}
      <PricingPlans />
      
      {/* FAQ Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { 
              q: "Is there a free trial?", 
              a: "Yes, all our plans come with a 30-day sfree trial. No credit card required to get started."
            },
            { 
              q: "What payment methods do you accept?", 
              a: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
            },
            { 
              q: "Can I change my plan later?", 
              a: "Absolutely! You can upgrade or downgrade your plan at any time."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 