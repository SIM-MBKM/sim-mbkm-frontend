"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ProgramCardProps {
  imageUrl: string
  logoUrl: string
  logoAlt: string
  position: "left" | "right"
}

export function ProgramCard({ imageUrl, logoUrl, logoAlt, position }: ProgramCardProps) {
  return (
    <div className="relative w-full bg-white border-gray-200 border-[3px] h-[200px] rounded-lg overflow-hidden mb-6">
      <Image src={imageUrl || "/placeholder.svg"} alt="Program background" fill style={{ objectFit: "cover" }} />

      <div className="absolute inset-0 flex items-center justify-between p-6">
        <div className={`w-32 h-12 relative ${position === "right" ? "order-2" : "order-1"}`}>
          <Image src={logoUrl || "/placeholder.svg"} alt={logoAlt} fill style={{ objectFit: "contain" }} />
        </div>

        <Button className="bg-[#003478] hover:bg-[#00275a] order-last text-white">Telusuri Program</Button>
      </div>
    </div>
  )
}
