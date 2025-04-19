import { LinkIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ReviewSection() {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-[#003478] mb-4 md:mb-6">Perlu Ditinjau.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <LinkIcon className="h-5 w-5 text-gray-700 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Logbook</div>
                <p>Harap melengkapi Logbook.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <LinkIcon className="h-5 w-5 text-gray-700 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Ekivalensi</div>
                <p>Harap merevisi Ekivalensi mata kuliah anda.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
