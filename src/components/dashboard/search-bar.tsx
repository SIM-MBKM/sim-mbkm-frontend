"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function SearchBar() {
  return (
    <div className="flex mt-20 flex-col md:flex-row gap-3 mb-6">

      <div className="flex-1 flex flex-col md:flex-row gap-3">
        <Select>
          <SelectTrigger className="w-full md:w-[240px] bg-white">
            <SelectValue placeholder="Tipe Kegiatan" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="magang">Magang</SelectItem>
            <SelectItem value="studi">Studi Independen</SelectItem>
            <SelectItem value="pertukaran">Pertukaran Pelajar</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full md:w-[240px] bg-white">
            <SelectValue placeholder="Level Kegiatan" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="nasional">Nasional</SelectItem>
            <SelectItem value="internasional">Internasional</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-[#003478] hover:bg-[#00275a] text-white">Cari</Button>
      </div>
    </div>
  )
}
