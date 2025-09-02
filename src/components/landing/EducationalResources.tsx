'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { FileText, ArrowRight, BookOpen, Video, Headphones, FileCheck, ChevronLeft, ChevronRight, TrendingUp, Clock } from "lucide-react";

export function EducationalResources() {
  const [activeTab, setActiveTab] = useState('all');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Guides' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'webinars', name: 'Webinars' },
    { id: 'case-studies', name: 'Case Studies' },
  ];

  const resources = [
    {
      id: 1,
      title: "How to do payroll in 9 steps",
      description: "A comprehensive guide to setting up and managing payroll for your small business, including compliance tips and best practices.",
      category: 'guides',
      readTime: '8 min read',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      image: 'https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: "How to write a business plan",
      description: "Learn how to create a solid business plan that will guide your company to success and help secure funding.",
      category: 'guides',
      readTime: '12 min read',
      icon: <FileText className="h-6 w-6 text-green-600" />,
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      image: 'https://media.istockphoto.com/id/1026400680/photo/financial-spreadsheet-report.jpg?s=612x612&w=0&k=20&c=-MizrLOlNcijxkTMn-3RaE50gT9yO8fN-iezzt06Ppk='
    },
    {
      id: 3,
      title: "Financial forecasting for startups",
      description: "Master the art of financial forecasting to make informed business decisions and attract investors.",
      category: 'tutorials',
      readTime: '15 min read',
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      title: "Tax deductions you might be missing",
      description: "Discover commonly overlooked tax deductions that could save your business thousands this year.",
      category: 'webinars',
      readTime: '45 min watch',
      icon: <Video className="h-6 w-6 text-amber-600" />,
      color: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 5,
      title: "Scaling your business efficiently",
      description: "Learn strategies for scaling your business without sacrificing quality or company culture.",
      category: 'case-studies',
      readTime: '10 min read',
      icon: <TrendingUp className="h-6 w-6 text-rose-600" />,
      color: 'from-rose-500 to-rose-600',
      iconBg: 'bg-rose-100',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 6,
      title: "Podcast: Financial wellness for entrepreneurs",
      description: "Listen to industry experts discuss maintaining financial health while growing your business.",
      category: 'webinars',
      readTime: '32 min listen',
      icon: <Headphones className="h-6 w-6 text-indigo-600" />,
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
  ];

  const filteredResources = activeTab === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeTab);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'right' ? 300 : -300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

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
        type: 'spring',
        stiffness: 100,
        damping: 20
      } 
    },
  };

  return (
    <section id="resources" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
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
            Learning Center
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grow Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Business Knowledge</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our library of resources designed to help you succeed in every aspect of business management.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="flex overflow-x-auto pb-2 mb-12 scrollbar-hide"
          ref={scrollContainerRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex space-x-2 px-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Scroll arrows */}
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-600 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-600 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>

        {/* Resource Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredResources.map((resource) => (
              <motion.div 
                key={resource.id}
                variants={item}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4 }}
                className="group"
                onMouseEnter={() => setIsHovered(resource.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Card className="h-full bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${resource.image})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex items-center text-white text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {resource.readTime}
                      </div>
                    </div>
                    <div className={`absolute top-4 right-4 w-12 h-12 ${resource.iconBg} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      {resource.icon}
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${resource.color} mr-2`}></span>
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1).replace('-', ' ')}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {resource.description}
                    </p>
                    {/* <Button 
                      variant="ghost" 
                      className="px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent group"
                    >
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button> */}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
