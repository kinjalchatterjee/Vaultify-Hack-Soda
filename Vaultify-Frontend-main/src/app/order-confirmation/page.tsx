'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ShoppingCart, Heart, Search, Check, Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Adjust weights as needed
})

// Mock data for the confirmed order
const confirmedOrder = {
  orderId: 'ORD-12345-ABCDE',
  transactionId: 'TXN-67890-XYZ', // Add transactionId here
  items: [
    { id: 1, name: 'Headphones', description: 'Color: Black, Size: N/A', price: 29.99, quantity: 2, image: '/image.png?height=80&width=80' },
    { id: 2, name: 'Dress', description: 'Color: Red, Size: L', price: 39.99, quantity: 1, image: '/dress.png?height=80&width=80' },
  ],
  subtotal: 99.97,
  shipping: 5,
  total: 104.97,
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main St',
    city: 'Anytown',
    zipCode: '12345',
  },
  paymentMethod: '**** **** **** 1234',
  estimatedDelivery: 'May 15, 2024',
}

export default function OrderConfirmationPage() {
  return (
    <div className={`min-h-screen bg-gray-100 ${poppins.className}`}>
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
          Home &gt; Shop &gt; Cart &gt; Checkout &gt; <span className="font-semibold">Confirmation</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-500 mr-4" />
              <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            </div>
            <p className="text-center text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="text-center mb-6">
              <p className="font-semibold">Order Number: {confirmedOrder.orderId}</p>
              <p className="text-sm text-gray-600">Please save this number for your records.</p>
            </div>
            <Separator className="my-6" />
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {confirmedOrder.items.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${confirmedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${confirmedOrder.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${confirmedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
            <p>{confirmedOrder.shippingAddress.name}</p>
            <p>{confirmedOrder.shippingAddress.address}</p>
            <p>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.zipCode}</p>
            <p className="mt-4">
              <span className="font-semibold">Estimated Delivery:</span> {confirmedOrder.estimatedDelivery}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
            <p>
              <span className="font-semibold">Payment Method:</span> 
              <span className="ml-2">
                Paid securely with <span className="text-blue-600 font-semibold">Vaultify</span> 
                {confirmedOrder.transactionId 
                  ? ` (Transaction ID: ${confirmedOrder.transactionId.slice(0, 4)}****)` 
                  : " (Transaction details not available)"}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your payment details were encrypted and secured with Vaultify, ensuring your privacy and security.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex items-center">
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
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
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="mt-2 text-sm">SSL Secure Payment</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
