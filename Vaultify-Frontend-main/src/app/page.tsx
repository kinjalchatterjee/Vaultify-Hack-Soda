'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Shield, Lock, Users, Eye, Key, Database, Network, Zap, Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// GrammarlyHandler Component
function GrammarlyHandler({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  

  return <>{children}</>;
}

// FAQ Accordion Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ title, price, features, isPopular }: { title: string; price: string; features: string[]; isPopular?: boolean }) => (
  <div className={cn("border rounded-lg p-6", isPopular ? "border-blue-500 shadow-lg" : "border-gray-200")}>
    {isPopular && <div className="text-blue-500 font-bold mb-2">Most Popular</div>}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <div className="text-3xl font-bold mb-4">{price}</div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Shield className="h-5 w-5 text-green-500 mr-2" />
          {feature}
        </li>
      ))}
    </ul>
    <Button className="w-full" variant={isPopular ? "default" : "outline"}>Choose Plan</Button>
  </div>
);

// BentoGrid Components
const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>
    {children}
  </div>
);

const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  isBlack = false,
  image,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  isBlack?: boolean;
  image?: string;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none border border-transparent flex flex-col",
        isBlack ? "bg-black text-white" : "bg-white text-black",
        className
      )}
    >
      <div className="relative h-[50%] w-full rounded-t-xl overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={typeof title === 'string' ? title : 'Feature image'}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover/bento:scale-110"
          />
        )}
      </div>
      <div className="p-4 flex flex-col justify-between h-[50%]">
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          <div className="flex items-center space-x-2 mb-2">
            {icon}
            <div className={cn("font-sans font-bold", isBlack ? "text-white" : "text-neutral-600")}>
              {title}
            </div>
          </div>
          <div className={cn("font-sans font-normal text-sm", isBlack ? "text-white/70" : "text-neutral-600")}>
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

// Staircase Step Component
const StaircaseStep = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ y, opacity }}
      className={`flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md`}>
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      const ScrollToPlugin = (await import('gsap/ScrollToPlugin')).default;

      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      const sections = [heroRef, featuresRef, howItWorksRef, pricingRef, faqRef];

      sections.forEach((section) => {
        gsap.fromTo(
          section.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray('a[href^="#"]').forEach((anchor: any) => {
        anchor.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          gsap.to(window, {
            duration: 0.6,
            scrollTo: targetId,
            ease: "power3.inOut",
          });
        });
      });
    };

    initGSAP();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const items = [
    { 
      title: "Blockchain-Powered Security", 
      description: "Your data is encrypted and stored on a secure, private blockchain.", 
      icon: <Database className="h-5 w-5 text-violet-500" />, 
      image: "/blockchain.png",
      className: "md:col-span-2",
      isBlack: true,
    },
    { 
      title: "User-Controlled Access", 
      description: "Grant or revoke access to your data at any time.", 
      icon: <Lock className="h-5 w-5 text-blue-500" />, 
      image: "/user.png",
      className: "md:col-span-1",
      isBlack: true,
    },
    { 
      title: "Transparent Logging", 
      description: "View a complete history of who accessed your data and when.", 
      icon: <Eye className="h-5 w-5 text-green-500" />, 
      image: "/transparency1.png",
      className: "md:col-span-1",
      isBlack: true,
    },
    { 
      title: "Seamless Integration", 
      description: "Our system integrates smoothly with e-commerce platforms.", 
      icon: <Network className="h-5 w-5 text-pink-500" />, 
      image: "/teamwork1.png",
      className: "md:col-span-2",
      isBlack: true,
    },
  ];

  const howItWorks = [
    { title: "Register", description: "Sign up and securely store your encrypted data on our blockchain.", icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: "Control", description: "Grant or revoke access to your data with just a few clicks.", icon: <Lock className="h-6 w-6 text-green-500" /> },
    { title: "Monitor", description: "Track who accesses your data with transparent logging.", icon: <Eye className="h-6 w-6 text-purple-500" /> },
  ];

  const faqItems = [
    { question: "How secure is Vaultify?", answer: "Vaultify uses state-of-the-art blockchain technology and encryption to ensure your data is always secure." },
    { question: "Can I control who accesses my data?", answer: "Yes, you have full control over who can access your data and can revoke access at any time." },
    { question: "Is Vaultify compliant with data protection regulations?", answer: "Yes, Vaultify is fully compliant with GDPR, CCPA, and other major data protection regulations." },
    { question: "How does the pricing work?", answer: "We offer flexible pricing plans based on your needs. Check out our pricing section for more details." },
  ];

  return (
    <GrammarlyHandler>
      <main className={`min-h-screen ${isDarkMode ? 'dark' : ''} ${poppins.className}`}>
        <div className="fixed top-4 right-4 z-50">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden pt-24 pb-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white"
              >
                Secure Your Digital Identity with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Vaultify</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-xl"
              >
                Take control of your personal data with our revolutionary blockchain-based identity management system. Built for security, designed for simplicity.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row justify-center"
              >
                            <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/sign-up")}>
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Button>
                <Button  size="lg" variant="outline" className="gap-2">Learn More <ExternalLink className="h-4 w-4" /></Button>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose Vaultify?</h2>
            <BentoGrid className="max-w-5xl mx-auto">
              {items.map((item, i) => (
                <BentoGridItem  
                  key={i} 
                  title={item.title} 
                  description={item.description} 
                  icon={item.icon} 
                  image={item.image}
                  className={item.className}
                  isBlack={item.isBlack}
                />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How Vaultify Works</h2>
            <div className="max-w-4xl mx-auto">
              {howItWorks.map((step, index) => (
                <StaircaseStep
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard 
                title="Basic" 
                price="$9.99/mo" 
                features={["Up to 1,000 identities", "Basic encryption", "Email support"]}
              />
              <PricingCard 
                title="Pro" 
                price="$29.99/mo" 
                features={["Up to 10,000 identities", "Advanced encryption", "Priority support", "API access"]}
                isPopular
              />
              <PricingCard 
                title="Enterprise" 
                price="Custom" 
                features={["Unlimited identities", "Custom solutions", "24/7 dedicated support", "On-premise options"]}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Vaultify</h3>
                <p className="text-gray-600 dark:text-gray-400">Securing digital identities with blockchain technology.</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Terms</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Privacy</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">Contact</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
              © 2024 Vaultify. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </GrammarlyHandler>
  );
}