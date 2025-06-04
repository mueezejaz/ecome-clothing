"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const footerSections = [
    {
      title: "Shop",
      links: ["Women", "Men", "Children", "Sale", "New Arrivals"],
    },
    {
      title: "Customer Care",
      links: ["Contact Us", "Size Guide", "Shipping Info", "Returns", "FAQ"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Sustainability", "Privacy Policy"],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">ELEGANCE</h3>
            <p className="text-gray-600 mb-6">
              Timeless fashion for the modern family. Quality, style, and elegance in every piece.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-gray-700" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-8 text-center text-gray-600"
        >
          <p>&copy; 2024 Elegance. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
