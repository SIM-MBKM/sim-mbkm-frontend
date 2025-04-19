import { Calendar, FileText, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function StatusCards() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <User className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Verifikasi Dosen</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Status Verifikasi</p>
          <p className="text-xl font-bold">Belum Terverifikasi</p>
        </CardContent>
      </Card>

      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <FileText className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Dokumentasi</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Status Verifikasi</p>
          <p className="text-xl font-bold">Belum Terverifikasi</p>
        </CardContent>
      </Card>

      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <Calendar className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Status Monev</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Monev ke -2</p>
          <p className="text-xl font-bold">Jadwal Terverifikasi</p>
        </CardContent>
      </Card>
    </div>
  )
}
