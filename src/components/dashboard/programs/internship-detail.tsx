import Image from "next/image"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InternshipDetailProps {
  internship: {
    name: string;
    program_provider: string;
    location: string;
  }
}

export function InternshipDetail({ internship }: InternshipDetailProps) {
  const courses = [
    { id: 1, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
    { id: 2, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
    { id: 3, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
    { id: 4, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
    { id: 5, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
    { id: 6, code: "UPMB 3000", name: "Data Mining", credits: "CPMK 1 - CPMK 2 - CPMK 3" },
  ]

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <Image
            src="/placeholder.svg?height=60&width=60&text=Icon"
            alt="Company Logo"
            width={60}
            height={60}
            className="rounded-full bg-gray-200"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{internship.name}</h2>
          <p className="text-gray-700">{internship.program_provider}</p>
          <p className="text-gray-700">{internship.location}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200">
          Daftar
        </Button>
        <Button variant="outline">Simpan</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Link Detail</p>
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-gray-700" />
            <a href="#" className="text-sm text-gray-700 hover:underline">
              https://www.example.com/id
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Secondary Link</p>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10L16 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 14L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 18L12 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <a href="#" className="text-sm text-gray-700 hover:underline">
              https://www.example.com/id
            </a>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Mata Kuliah Relevan</h3>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">{course.code}</p>
              <p className="font-medium">{course.name}</p>
              <p className="text-xs text-gray-500">{course.credits}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
