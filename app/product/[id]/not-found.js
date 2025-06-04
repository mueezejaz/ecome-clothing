"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Product Not Found</h1>

          <p className="text-xl text-gray-600 mb-8">
            Sorry, the product you're looking for doesn't exist or has been removed.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Link href="/">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Shopping
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
