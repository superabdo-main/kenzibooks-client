"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import {
  CheckCircle2,
  Zap,
  BadgeCheck,
  Clock,
  MessageSquare,
  BarChart2,
  CreditCard,
  Users,
  FileText,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import SubscribeButton from "./subscribe-button";

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const features = [
    { name: "Unlimited Invoicing", icon: FileText },
    { name: "Expense Tracking", icon: BarChart2 },
    { name: "Financial Reports", icon: BarChart2 },
    { name: "Email Support", icon: MessageSquare },
    { name: "Team Members", icon: Users },
    { name: "Priority Support", icon: Users },
    { name: "Custom Reports", icon: BarChart2 },
    { name: "Dedicated Account Manager", icon: Users },
    { name: "Onboarding Session", icon: Clock },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 7,
      priceId: 'starter',
      description: "Per Month",
      featured: false,
      features: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      color: "from-blue-500 to-blue-600",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 70,
      priceId: 'professional',
      description: "Per Year",
      featured: true,
      features: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      color: "from-blue-600 to-indigo-600",
      buttonVariant: "default" as const,
      popular: true,
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "annually" : "monthly"));
  };

  // Calculate savings for annual billing
  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyTotal = monthly * 12;
    return Math.round(((monthlyTotal - annual) / monthlyTotal) * 100);
  };

  return (
    <section
      className="relative py-16 md:py-24 bg-white overflow-hidden"
      id="pricing"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Plans that{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Scale
            </span>{" "}
            With You
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. Start with a 30-days
            free trial, no credit card required.
          </p>
        </motion.div>

        {/* <motion.div
          className="flex items-center justify-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span
            className={`text-sm md:text-base font-medium mr-4 ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}
          >
            Monthly Billing
          </span>
          <button
            onClick={toggleBillingCycle}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Toggle billing cycle"
          >
            <span
              className={`transform transition-transform duration-300 ease-in-out inline-flex h-6 w-6 items-center justify-center rounded-full ${
                billingCycle === "annually"
                  ? "translate-x-7 bg-blue-600"
                  : "translate-x-0 bg-white"
              }`}
            >
              {billingCycle === "monthly" ? (
                <span className="text-sm font-medium text-gray-700">M</span>
              ) : (
                <span className="text-sm font-medium text-white">Y</span>
              )}
            </span>
          </button>
          <div className="ml-4 relative">
            <span
              className={`text-sm md:text-base font-medium ${billingCycle === "annually" ? "text-gray-900" : "text-gray-500"}`}
            >
              Annual Billing
            </span>
            {billingCycle === "annually" && (
              <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                Save up to 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {plans.map((plan) => {
            const price = plan.price;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                variants={item}
                className="relative"
                onMouseEnter={() => setIsHovered(plan.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md z-10">
                    Most Popular
                  </div>
                )}

                <Card
                  className={`h-full flex flex-col transition-all duration-300 bg-white border-gray-200 ${
                    isPopular
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm hover:shadow-md"
                  } overflow-hidden`}
                >
                  <div
                    className={`h-1.5 bg-gradient-to-r ${plan.color} w-full`}
                  ></div>

                  <CardHeader className="pb-2 pt-6 px-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {plan.name}
                        </CardTitle>
                        <p className="text-2xl font-bold text-gray-900">
                          {price}$
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {plan.description}
                        </p>
                      </div>
                      {isPopular && (
                        <div className="bg-yellow-50 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Best Value</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pt-2 px-6 pb-6">
                    <ul className="space-y-3">
                      {features.map((feature, featureIndex) => {
                        const isIncluded = plan.features.includes(featureIndex);
                        const Icon = feature.icon;

                        return (
                          <li
                            key={featureIndex}
                            className={`flex items-start ${isIncluded ? "text-gray-800" : "text-gray-400"}`}
                          >
                            {isIncluded ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                            )}
                            <span
                              className={`text-sm ${!isIncluded ? "line-through" : ""}`}
                            >
                              {feature.name}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-auto pt-2 px-6 pb-6">
                  <SubscribeButton priceId={plan.priceId!}/>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
