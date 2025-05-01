"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Users } from "lucide-react"
import { useState } from "react"

interface Program {
  id: string;
  name: string;
  description: string;
  count: number;
}

interface ProgramCardProps {
  program: Program;
  imageUrl: string;
  logoUrl: string;
  logoAlt: string;
  position: "left" | "right";
}

export function ProgramCard({ program, imageUrl, logoUrl, logoAlt, position }: ProgramCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" 
      }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
      
      {/* Background image */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative h-[220px]"
      >
        <Image 
          src={imageUrl} 
          alt="Program background" 
          fill 
          style={{ objectFit: "cover" }} 
        />
      </motion.div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          {/* Logo */}
          <motion.div 
            className={`w-32 h-16 relative bg-white/90 rounded-lg p-2 flex items-center justify-center ${
              position === "right" ? "order-2" : "order-1"
            }`}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image 
              src={logoUrl} 
              alt={logoAlt} 
              width={100} 
              height={40} 
              style={{ objectFit: "contain" }}
            />
          </motion.div>
          
          {/* Program count badge */}
          <motion.div 
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{program.count} Program</span>
          </motion.div>
        </div>
        
        {/* Program info */}
        <div className="text-white">
          <motion.h3 
            className="text-2xl font-bold mb-2 drop-shadow-md"
            initial={{ opacity: 0, x: position === "right" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {program.name}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-white/90 line-clamp-2 mb-4 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {program.description}
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white group"
              size="sm"
            >
              <span>Telusuri Program</span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Accent decoration */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1.5 bg-blue-600"
        initial={{ width: "30%" }}
        animate={{ width: isHovered ? "100%" : "30%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
