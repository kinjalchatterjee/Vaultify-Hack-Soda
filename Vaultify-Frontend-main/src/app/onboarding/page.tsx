'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Eye, CreditCard, ArrowLeft } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { gsap } from 'gsap';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

const pageVariants = {
  initial: { opacity: 0, x: '-100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '100%' }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.7 // Increased duration for smoother transition
};

export default function OnboardingFlow() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isCardValid, setIsCardValid] = useState(false);

  const goToNextStep = () => setStep(step + 1);
  const goToPreviousStep = () => setStep(step - 1);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim());
      setIsCardValid(value.length === 16);
    }
  };
  
  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpirationDate(value.slice(0, 5));
  };
  
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };
  
  const handleCompleteSetup = async () => {
    if (user) {
      await fetch('/api/updateMetadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          hasCompletedOnboarding: true,
        }),
      });
    }
    router.push('/dashboard');
  };
  
  useEffect(() => {
    if (isCardValid && expirationDate.length === 5 && cvc.length === 3) {
      gsap.to('.card-valid-animation', {
        backgroundColor: '#4caf50',
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [isCardValid, expirationDate, cvc]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-wrap lg:flex-nowrap w-full"
          >
            <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">Welcome to Vaultify!</h1>
              <p className="text-lg mb-8 text-gray-600 text-center">Let's get to know you better!</p>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <Button onClick={goToNextStep} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md">Next Step</Button>
            </div>
            <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
              <Image
                src="/image1.jpg"
                alt="Welcome Illustration"
                width={700}
                height={700}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-wrap lg:flex-nowrap w-full"
          >
            <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
              <Image
                src="/image2.png"
                alt="Features Illustration"
                width={700}
                height={700}
                layout="responsive"
                objectFit="contain"
              />
            </div>
            <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">Why Choose Vaultify?</h2>
              <div className="space-y-6">
                <Card className="bg-white shadow-md">
                  <CardContent className="flex items-center p-4">
                    <Lock className="w-8 h-8 mr-4 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg text-blue-800">Blockchain Security</h3>
                      <p className="text-sm text-gray-600">All your data is protected and secured using blockchain technology.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-md">
                  <CardContent className="flex items-center p-4">
                    <Eye className="w-8 h-8 mr-4 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg text-blue-800">User Control</h3>
                      <p className="text-sm text-gray-600">Only you control who gets to access your data.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={goToPreviousStep} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextStep} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md">Enter Card Details</Button>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-wrap lg:flex-nowrap w-full"
          >
            <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">Enter Your Card Information</h2>
              <p className="text-sm text-gray-600 mb-6 text-center">Your payment information is secure and encrypted.</p>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  readOnly
                  className="w-full border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  readOnly
                  className="w-full border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                />
                <Input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full border p-3 rounded-md focus:outline-none transition-colors duration-300 ${isCardValid ? 'border-gray-300 card-valid-animation' : 'border-red-500'}`}
                />
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expirationDate}
                    onChange={handleExpirationDateChange}
                    className="w-1/2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <Input
                    type="password"
                    placeholder="CVC"
                    value={cvc}
                    onChange={handleCvcChange}
                    className="w-1/2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={goToPreviousStep} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button onClick={handleCompleteSetup} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Complete Setup
                </Button>
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">Rest assured, your information is in good hands. We use advanced encryption technology to ensure your data stays protected and private.</p>
              {isCardValid && expirationDate.length === 5 && cvc.length === 3 && (
                <p className="mt-4 text-center text-sm text-green-500 animate-pulse">Card details look great! Ready to proceed.</p>
              )}
            </div>
            <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
              <Image
                src="/image3.jpg"
                alt="Payment Illustration"
                width={700}
                height={700}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-white to-blue-100 flex items-center justify-center`}>
      <div className="w-full max-w-7xl flex flex-wrap lg:flex-nowrap bg-white shadow-lg rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}