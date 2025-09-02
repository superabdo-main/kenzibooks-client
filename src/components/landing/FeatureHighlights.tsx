'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { 
  LineChart, 
  Users, 
  Wallet, 
  BookOpen, 
  CreditCard, 
  ShieldCheck,
  BarChart2,
  PieChart,
  TrendingUp,
  FileText,
  DollarSign,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';

export function FeatureHighlights() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const categories = [
    { id: 'analytics', name: 'Analytics', icon: BarChart2 },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'productivity', name: 'Productivity', icon: Zap },
  ];

  const features = {
    analytics: [
      {
        icon: LineChart,
        title: 'Profit at a Glance',
        description: 'Get real-time insights into your business performance with beautiful, easy-to-understand dashboards.',
        color: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: BarChart2,
        title: 'Advanced Reporting',
        description: 'Generate detailed reports with custom metrics and KPIs to track your business growth.',
        color: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        icon: PieChart,
        title: 'Revenue Analytics',
        description: 'Visualize your revenue streams and identify your most profitable products or services.',
        color: 'from-rose-500 to-rose-600',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600'
      },
    ],
    finance: [
      {
        icon: Wallet,
        title: 'Manage Money',
        description: 'Connect your bank accounts and credit cards for automatic transaction imports and reconciliation.',
        color: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      {
        icon: CreditCard,
        title: 'Accept Payments',
        description: 'Get paid faster with integrated payment processing for cards, ACH, Apple Pay, and more.',
        color: 'from-indigo-500 to-indigo-600',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      {
        icon: ShieldCheck,
        title: 'Tax Ready',
        description: 'Everything organized and ready for tax season, with expert support when you need it.',
        color: 'from-amber-500 to-amber-600',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      },
    ],
    productivity: [
      {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Run payroll and handle taxes with just a few clicks. Keep your team happy and compliant.',
        color: 'from-violet-500 to-violet-600',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600'
      },
      {
        icon: BookOpen,
        title: 'Get Books Done',
        description: 'Let our experts handle your bookkeeping while you focus on growing your business.',
        color: 'from-cyan-500 to-cyan-600',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
      },
      {
        icon: FileText,
        title: 'Document Management',
        description: 'Store, organize, and manage all your financial documents in one secure location.',
        color: 'from-fuchsia-500 to-fuchsia-600',
        iconBg: 'bg-fuchsia-100',
        iconColor: 'text-fuchsia-600'
      },
    ]
  };

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = categories.findIndex(cat => cat.id === activeTab);
      const nextIndex = (currentIndex + 1) % categories.length;
      setActiveTab(categories[nextIndex].id);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of tools is designed to streamline your workflow and help your business thrive.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-5 w-5 mr-2 ${activeTab === category.id ? 'text-white' : 'text-blue-600'}`} />
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {features[activeTab as keyof typeof features].map((feature, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Card className="h-full bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <CardHeader className="pb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.iconBg} rounded-2xl mb-4 transition-all duration-300 ${isHovered === index ? 'scale-110' : ''}`}>
                      <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    {/* <Button 
                      variant="ghost" 
                      className="px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent group"
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button> */}
                  </CardContent>
                </Card>
                
                {/* Hover effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
                ></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to transform your business?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust us to power their financial success.
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
}
