"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CategorySection() {
  const categories = [
    {
      title: "Women's Collection",
      description: "Sophisticated styles for the modern woman",
      image: "/hero/placeholder.png",
      href: "#women",
    },
    {
      title: "Men's Collection",
      description: "Contemporary fashion for the discerning gentleman",
      image: "/hero/placeholder.png",
      href: "#men",
    },
    {
      title: "Children's Collection",
      description: "Playful yet elegant designs for little ones",
      image: "/hero/placeholder.png",
      href: "#children",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every member of your family
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-96 overflow-hidden">
                <motion.img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-200 mb-4">{category.description}</p>
                <Button variant="outline" className="border-none bg-gray-900 text-white hover:bg-white hover:text-gray-900 group">
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
