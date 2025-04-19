import { Bell, Info, ListCheck } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"

import { Card, CardContent } from "../ui/card"

export function ActivityFeed() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#003478] mb-4 md:mb-6">Aktifitas Terbaru.</h2>
      <div className="space-y-4 h-100 overflow-scroll">
        <Card className="border-gray-300 border-[2px] shadow-lg">
          <CardContent className="px-2 py-2">
            <div className="flex items-center space-x-4">
              <ListCheck className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex-col flex">
              <div className="text-sm text-gray-500 whitespace-nowrap">12 Sep 2024</div>
              <div>
                <p>
                  Mitra MBKM Magang PT Astra Indonesia telah ditambahkan. Cek{" "}
                  <a href="#" className="text-blue-600">
                    disini
                  </a>{" "}
                  segera.
                </p>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 border-[2px] shadow-lg">
          <CardContent className="px-2 py-2">
            <div className="flex items-center space-x-4">
              <Info className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex-col flex">
              <div className="text-sm text-gray-500 whitespace-nowrap">12 Sep 2024</div>
              <div>
                <p>
                  Mitra MBKM Magang PT Astra Indonesia telah ditambahkan. Cek{" "}
                  <a href="#" className="text-blue-600">
                    disini
                  </a>{" "}
                  segera.
                </p>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 border-[2px] shadow-lg">
          <CardContent className="px-2 py-2">
            <div className="flex items-center space-x-4">
              <ListCheck className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex-col flex">
              <div className="text-sm text-gray-500 whitespace-nowrap">12 Sep 2024</div>
              <div>
                <p>
                  Mitra MBKM Magang PT Astra Indonesia telah ditambahkan. Cek{" "}
                  <a href="#" className="text-blue-600">
                    disini
                  </a>{" "}
                  segera.
                </p>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 border-[2px] shadow-lg">
          <CardContent className="px-2 py-2">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex-col flex">
              <div className="text-sm text-gray-500 whitespace-nowrap">12 Sep 2024</div>
              <div>
                <p>
                  Mitra MBKM Magang PT Astra Indonesia telah ditambahkan. Cek{" "}
                  <a href="#" className="text-blue-600">
                    disini
                  </a>{" "}
                  segera.
                </p>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
