"use client"
import { useState } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import { ChevronDown, ArrowRight } from '@/components/icons';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What are the benefits of cloud accounting?',
    answer: 'Cloud accounting allows you to access your financial data anytime, anywhere, on any device. It provides real-time collaboration with your team and accountant, automatic software updates, enhanced security with bank-level encryption, and eliminates the need for manual backups.'
  },
  {
    question: 'How secure is my data with KenziBooks?',
    answer: 'Your data security is our top priority. We use 256-bit SSL encryption for all data in transit and at rest. Our servers are hosted in highly secure data centers with multiple layers of physical and digital security. We also offer two-factor authentication for an extra layer of protection.'
  },
  {
    question: 'Is KenziBooks suitable for my business?',
    answer: 'KenziBooks is designed to work for businesses of all sizes, from freelancers and startups to established enterprises. Our scalable solutions can be customized to fit your specific industry needs, whether you\'re in retail, services, manufacturing, or professional services.'
  },
  {
    question: 'How can I give my accountant access?',
    answer: 'You can easily grant your accountant or bookkeeper access to your KenziBooks account. Simply go to your account settings, add their email address, and set their permission level. They\'ll receive an email invitation to access your account securely.'
  }
];

const FAQItem = ({ faq, index, isOpen, onClick }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onClick: () => void }) => (
  <motion.div
    initial={false}
    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
    whileHover={{ translateY: -2 }}
  >
    <button
      className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={`faq-${index}`}
    >
      <span className="text-lg font-medium text-gray-900 md:text-xl">{faq.question}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="ml-4 flex-shrink-0"
      >
        <ChevronDown className="h-6 w-6 text-blue-600" />
      </motion.span>
    </button>
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          id={`faq-${index}`}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="px-6 pb-6"
          aria-hidden={!isOpen}
        >
          <div className="prose max-w-none text-gray-600">
            <p>{faq.answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100 opacity-30 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-100 opacity-30 blur-3xl" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
            FAQ
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Everything you need to know about KenziBooks. Can't find what you're looking for?
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="mx-auto mt-16 max-w-3xl space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </motion.div>

        {/* CTA Card */}
        {/* <motion.div 
          className="mt-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-0.5 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-white p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Still have questions?</h3>
              <p className="mt-2 text-lg text-gray-600">Can't find the answer you're looking for?</p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                onClick={() => window.location.href = '#contact'}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with us
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="group relative overflow-hidden border-gray-300 hover:bg-gray-50"
                onClick={() => window.location.href = 'mailto:support@kenzibooks.com'}
              >
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                Email us
              </Button>
            </div>
          </div>
        </motion.div> */}

        {/* Contact Cards */}
        <div className="mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Email Card */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-green-100 opacity-20 transition-all duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Email Support</h3>
                  <p className="mt-2 text-gray-600">Get answers to your questions via email from our support team.</p>
                  <a 
                    href="mailto:support@kenzibooks.com" 
                    className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    support@kenzibooks.com
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-100 opacity-20 transition-all duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Phone Support</h3>
                  <p className="mt-2 text-gray-600">Speak directly with our support team during business hours.</p>
                  <a 
                    href="tel:+1234567890" 
                    className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    +1 (234) 567-8900
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
