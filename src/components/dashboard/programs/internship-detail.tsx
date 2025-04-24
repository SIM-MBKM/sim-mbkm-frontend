import Image from "next/image"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Activity } from "@/lib/api/services/activity-service"

interface InternshipDetailProps {
  internship: Activity;
}

export function InternshipDetail({ internship }: InternshipDetailProps) {
  // Check if matching data exists
  const hasMatchings = internship.matching && internship.matching.length > 0;
  
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <Image
            src="/logo.png?height=60&width=60&text=Icon"
            alt="Company Logo"
            width={60}
            height={60}
            className="rounded-full bg-gray-200"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{internship.name}</h2>
          <p className="text-gray-700">{internship.program_provider}</p>
          <p className="text-gray-700">{internship.location || "Location not specified"}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Program Type: {internship.program_type || "Unknown"}</p>
            <p className="text-sm text-gray-600">Level: {internship.level || "Unknown"}</p>
            <p className="text-sm text-gray-600">Group: {internship.group || "Unknown"}</p>
            <p className="text-sm text-gray-600">Academic Year: {internship.academic_year || "Unknown"}</p>
            <p className="text-sm text-gray-600">Duration: {internship.months_duration || 0} months</p>
            <p className="text-sm text-gray-600">Status: {internship.approval_status || "Unknown"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200">
          Daftar
        </Button>
        <Button variant="outline">Simpan</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-700">
            {internship.description || "No description available."}
          </p>
        </div>
        {internship.web_portal && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Web Portal</p>
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-gray-700" />
              <a 
                href={internship.web_portal} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-700 hover:underline"
              >
                {internship.web_portal}
              </a>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Mata Kuliah Relevan</h3>
        {hasMatchings ? (
          <div className="grid grid-cols-3 gap-4">
            {internship.matching.flatMap((matching) => (
              <div key={matching.id} className="border rounded-lg p-3">
                <p className="text-xs text-gray-500">{matching.kode}</p>
                <p className="font-medium">{matching.mata_kuliah}</p>
                <p className="text-xs text-gray-500">
                  Semester: {matching.semester} | SKS: {matching.sks}
                </p>
                <p className="text-xs text-gray-500">
                  Prodi: {matching.prodi_penyelenggara}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No course matching data available for this program.</p>
          </div>
        )}
      </div>
    </div>
  )
}
