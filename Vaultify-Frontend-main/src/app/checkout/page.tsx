'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ShoppingCart, Heart, Search, Minus, Plus, CreditCard, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

// Mock data for cart items
const cartItems = [
  { id: 1, name: 'Headphones', description: 'Color: Black, Size: N/A', price: 29.99, quantity: 2, image: '/image.png?height=80&width=80' },
  { id: 2, name: 'Dress', description: 'Color: Red, Size: L', price: 39.99, quantity: 1, image: '/dress.png?height=80&width=80' },
]

export default function CheckoutPage() {
  const [items, setItems] = useState(cartItems)
  const [couponCode, setCouponCode] = useState('')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = shippingMethod === 'express' ? 10 : 5
  const total = subtotal + shipping

  const updateQuantity = (id, newQuantity) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handlePayment = () => {
    setIsProcessing(true)

    // Open the dashboard in a new tab for approval
    window.open('/dashboard', '_blank') // Open dashboard in a new tab for approval
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${poppins.className}`}>
      {/* Overlay Loading Screen */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75">
          <Image src="/illustration.png" alt="Processing" width={150} height={150} className="animate-pulse opacity-30" />
          <div className="mt-8 flex items-center space-x-4">
            <Loader className="animate-spin h-10 w-10 text-blue-500" />
            <p className="text-white text-2xl font-semibold">Authorizing Payment...</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Famazon</div>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6" />
            <ShoppingCart className="w-6 h-6" />
            <Heart className="w-6 h-6" />
            <UserButton />
          </div>
        </nav>
        <div className="container mx-auto px-4 py-2 text-sm">
          Home &gt; Shop &gt; Cart &gt; <span className="font-semibold">Checkout</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Summary */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
                <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-700">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline mt-2">
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-semibold mb-2">Discount Code</h3>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="mr-2"
                />
                <Button>Apply</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Checkout Details */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
              <form>
                <h3 className="font-semibold mb-2">Shipping Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" />
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-2">Delivery Options</h3>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard Shipping ($5)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express">Express Shipping ($10)</Label>
                  </div>
                </RadioGroup>

                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white" 
                  onClick={handlePayment}
                >
                  Pay with Vaultify
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">FAQs</a></li>
                <li><a href="#" className="hover:underline">Return Policy</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p>Email: support@example.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Secure Payments</h4>
              <div className="flex space-x-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <p className="mt-2 text-sm">SSL Secure Payment</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
