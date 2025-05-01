import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Document, Registration } from "@/lib/api/services/registration-service"
import { Matching, Equivalent } from "@/lib/api/services/registration-service"

interface RegistrationDetailProps {
  registration: Registration & { matching: Matching[] }
}

export function RegistrationDetail({ registration }: RegistrationDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Nama Program</p>
              <p>{registration.activity_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Posisi</p>
              <p>Intern Position</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {registration.lo_validation}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Nama</p>
              <p>{registration.user_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">NRP</p>
              <p>{registration.user_nrp}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Semester</p>
              <p>{registration.semester}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total SKS</p>
              <p>{registration.total_sks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Pembimbing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Dosen Pembimbing</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama</p>
                  <p>{registration.academic_advisor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{registration.academic_advisor_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status Validasi</p>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {registration.academic_advisor_validation}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Pembimbing Lapangan</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama</p>
                  <p>{registration.mentor_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{registration.mentor_email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {registration.documents.map((doc: Document) => (
              <div key={doc.id} className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.document_type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mata Kuliah Ekivalensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registration.equivalents && registration.equivalents.map((match: Equivalent) => (
              <div key={match.id} className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mata Kuliah</p>
                    <p>{match.mata_kuliah}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kode</p>
                    <p>{match.kode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">SKS</p>
                    <p>{match.sks}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Departemen</p>
                    <p>{match.departemen}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prodi Penyelenggara</p>
                    <p>{match.prodi_penyelenggara}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Semester</p>
                    <p>{match.semester}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
