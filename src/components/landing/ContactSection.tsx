import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Textarea } from '@/components/shadcn-ui/textarea';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Logo } from '@/components/icons';

const socialLinks = [
  { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#' },
  { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
  { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: '#' },
];

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'About us', href: '#about' },
  { name: 'Services', href: '#features' },
  { name: 'Features', href: '#features' },
  { name: 'Plan & Price', href: '#pricing' },
  { name: 'Privacy', href: '#' },
  { name: 'Terms', href: '#' },
];

export function ContactSection() {
  return (
    <footer id="contact" className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" rows={4} placeholder="Your message here..." />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                Have questions or need assistance? Our team is here to help you with any inquiries.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">626 Armstrong Ave W Suite 104, St Paul, MN 55102</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+16513714994" className="hover:text-primary transition-colors">
                    +1 651-371-4994
                  </a>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@kinzitaxation.com" className="hover:text-primary transition-colors">
                    info@kinzitaxation.com
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-4">Subscribe to our newsletter</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-grow" />
                <Button className="whitespace-nowrap">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                KenziBooks
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
              {footerLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  aria-label={social.name}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} KenziBooks. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
