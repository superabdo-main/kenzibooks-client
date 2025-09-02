'use client';

import { motion } from 'framer-motion';
import { Users, CheckCircle, FileText, Calculator, ArrowRight, BarChart, ShieldCheck, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';

const KeyDifferentiators = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20
      } 
    },
  };

  const features = [
    {
      icon: Users,
      title: "Expert Onboarding",
      description: "Get personalized setup assistance from our accounting experts",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Powerful insights and visualizations for data-driven decisions",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Transaction Reconciliation",
      description: "Automated matching and categorization of all your transactions",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: ShieldCheck,
      title: "Security First",
      description: "Enterprise-grade security to protect your financial data",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: FileText,
      title: "Report Reviews",
      description: "Professional review of your financial reports for accuracy",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed to save you time and boost productivity",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600"
    },
    {
      icon: Calculator,
      title: "Tax-Prep Readiness",
      description: "Ensure your books are always ready for tax season",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need it",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-100",
      iconColor: "text-violet-600"
    }
  ];

  return (
    <section id='key-differentiators' className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Success</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with intuitive design to give you
            everything you need to manage your business finances with confidence.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>
              
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              {/* <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div> */}
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses that trust us with their financial success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No credit card required • 30-days free trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyDifferentiators;
