import type { Subject, MatchingRequest } from "./types"
import { Activity } from '@/lib/api/services';

// Mock data based on the provided JSON
const mockActivities: Activity[] = [
  {
    id: "c3015e33-1cc6-4221-ad76-ece1fce2966c",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "IISMA Coy",
    description: "ini adalah program IISMA BARU ",
    start_period: "2025-05-29T17:00:00Z",
    months_duration: 1,
    activity_type: "WFH",
    location: "Surabaya",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  {
    id: "739490a3-34a0-4913-86d8-e8ac53b18f00",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Studi Independen",
    description: "Studi Independen adalah blababab",
    start_period: "2026-03-26T17:00:00Z",
    months_duration: 1,
    activity_type: "WFO",
    location: "Surabaya",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  {
    id: "bee9094f-7355-42c2-af38-a18dcca8890c",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Programm",
    description: "fnwefkjewfnwakefnawefiuwnif",
    start_period: "2025-04-28T17:00:00Z",
    months_duration: 4,
    activity_type: "WFO",
    location: "Jember",
    web_portal: "",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: [
      {
        id: "98504a5f-58de-4072-90b6-0a5784184af9",
        subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
        kode: "EF234722",
        mata_kuliah: "Magang 2",
        semester: "GANJIL",
        prodi_penyelenggara: "S-1 Teknik Informatika",
        sks: 6,
        kelas: "mbkm",
        departemen: "Teknik Informatika",
        tipe_mata_kuliah: "pilhan prodi",
        documents: [
          {
            document_type: "Acceptence Letter",
            file_storage_id: "sim_mbkm/7e315e0f-af28-4cbc-b05f-e5450914df72.docx",
            id: "c158b786-0757-4e0e-b28f-0ef83a519dc3",
            name: "DOKUMEN TESTING.docx",
            subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
          },
        ],
      },
      {
        id: "f9c710b9-5348-4d13-a8f9-43c4831422cb",
        subject_id: "f92b580f-d9df-4211-817f-f97c5b20887f",
        kode: "EF234723",
        mata_kuliah: "Sistem Basis Data",
        semester: "GANJIL",
        prodi_penyelenggara: "S-1 Teknik Informatika",
        sks: 6,
        kelas: "mbkm",
        departemen: "Teknik Informatika",
        tipe_mata_kuliah: "pilhan prodi",
        documents: [
          {
            document_type: "Acceptence Letter",
            file_storage_id: "sim_mbkm/b9906f30-cd62-4291-9b3e-41ede64cadfe.docx",
            id: "4d70adaa-10f9-41da-a0a0-4ec861554025",
            name: "DOKUMEN TESTING.docx",
            subject_id: "f92b580f-d9df-4211-817f-f97c5b20887f",
          },
        ],
      },
    ],
  },
  {
    id: "39a47244-6563-4e4b-8d71-0edf2f8783a6",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Learning and Development Intern Baru 2",
    description: "Ini adalah program baru yang tidak jelas",
    start_period: "2026-03-01T00:00:00Z",
    months_duration: 5,
    activity_type: "WFO",
    location: "Kota Jakarta Selatan",
    web_portal: "",
    academic_year: "2024/2025",
    program_provider: "Perusahaan A",
    approval_status: "APPROVED",
    submitted_by: "test3@gmail.com",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: [
      {
        id: "3c144310-0d4d-4b34-9c76-d0995d6e8c75",
        subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
        kode: "EF234722",
        mata_kuliah: "Magang 2",
        semester: "GANJIL",
        prodi_penyelenggara: "S-1 Teknik Informatika",
        sks: 6,
        kelas: "mbkm",
        departemen: "Teknik Informatika",
        tipe_mata_kuliah: "pilhan prodi",
        documents: [
          {
            document_type: "Acceptence Letter",
            file_storage_id: "sim_mbkm/7e315e0f-af28-4cbc-b05f-e5450914df72.docx",
            id: "c158b786-0757-4e0e-b28f-0ef83a519dc3",
            name: "DOKUMEN TESTING.docx",
            subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
          },
        ],
      },
      {
        id: "d234ffd1-052b-4dbf-b4f8-ee247e295b52",
        subject_id: "f92b580f-d9df-4211-817f-f97c5b20887f",
        kode: "EF234723",
        mata_kuliah: "Sistem Basis Data",
        semester: "GANJIL",
        prodi_penyelenggara: "S-1 Teknik Informatika",
        sks: 6,
        kelas: "mbkm",
        departemen: "Teknik Informatika",
        tipe_mata_kuliah: "pilhan prodi",
        documents: [
          {
            document_type: "Acceptence Letter",
            file_storage_id: "sim_mbkm/b9906f30-cd62-4291-9b3e-41ede64cadfe.docx",
            id: "4d70adaa-10f9-41da-a0a0-4ec861554025",
            name: "DOKUMEN TESTING.docx",
            subject_id: "f92b580f-d9df-4211-817f-f97c5b20887f",
          },
        ],
      },
    ],
  },
  {
    id: "d0369f9f-6d74-4eea-9136-eb794878b887",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Program Baru",
    description: "FJewofiwefijewfew",
    start_period: "2025-04-25T17:00:00Z",
    months_duration: 3,
    activity_type: "WFO",
    location: "Jember",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  {
    id: "c81c4229-0b84-4697-a124-9fc3303f1dd8",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Program Baru 2",
    description: "Ini adalah program baru yang tidak jelas",
    start_period: "2025-04-25T17:00:00Z",
    months_duration: 1,
    activity_type: "WFO",
    location: "Jember",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  {
    id: "e8a12865-d2fd-487b-b7ea-24a0ea63e173",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Program Bosku",
    description: "ini adalah sebuah program baru ajuan mahasewa",
    start_period: "2025-05-09T17:00:00Z",
    months_duration: 1,
    activity_type: "WFO",
    location: "Surabaya",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  {
    id: "26536960-05ab-40ee-9fc5-17b8ce6dc1dd",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Testing 2",
    description: "Ini adalah program baru yang tidak jelas",
    start_period: "2025-03-01T00:00:00Z",
    months_duration: 5,
    activity_type: "WFO",
    location: "Kota Jakarta Selatan",
    web_portal: "",
    academic_year: "2024/2025",
    program_provider: "Perusahaan A",
    approval_status: "APPROVED",
    submitted_by: "68beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "admin",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: [
      {
        id: "b6fdf265-1ea6-4dd3-a2eb-5eecbfe802da",
        subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
        kode: "EF234722",
        mata_kuliah: "Magang 2",
        semester: "GANJIL",
        prodi_penyelenggara: "S-1 Teknik Informatika",
        sks: 6,
        kelas: "mbkm",
        departemen: "Teknik Informatika",
        tipe_mata_kuliah: "pilhan prodi",
        documents: [
          {
            document_type: "Acceptence Letter",
            file_storage_id: "sim_mbkm/7e315e0f-af28-4cbc-b05f-e5450914df72.docx",
            id: "c158b786-0757-4e0e-b28f-0ef83a519dc3",
            name: "DOKUMEN TESTING.docx",
            subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
          },
        ],
      },
    ],
  },
  {
    id: "b2d50846-0b4d-4fa7-880e-7f79fd2a1717",
    program_type_id: "a3213869-7b19-49d8-bfae-b2ea99ea86a3",
    level_id: "682d2b83-2828-4df9-aed1-481b6b237880",
    group_id: "a0fe616a-77e0-45b9-8ffd-e27407ffe6cd",
    name: "Magang 3",
    description: "ini adalah program magang ajuan mahasiswa",
    start_period: "2025-05-02T17:00:00Z",
    months_duration: 1,
    activity_type: "WFO",
    location: "Surabaya",
    web_portal: "https://google.com",
    academic_year: "2024/2025",
    program_provider: "ITS",
    approval_status: "APPROVED",
    submitted_by: "58beb504-1b33-430d-8563-eba349abd584",
    submitted_user_role: "MAHASISWA",
    program_type: "Magang",
    level: "Regional",
    group: "ITS",
    matching: null,
  },
  // Add activities with different program types, levels, and groups
  {
    id: "f1e2d3c4-b5a6-7890-f1e2-d3c4b5a67890",
    program_type_id: "b4321987-6543-21ab-cdef-b4321987654",
    level_id: "791e2d3c-4b5a-6789-0f1e-2d3c4b5a678",
    group_id: "b0fe616a-88e0-45b9-8ffd-e27407ffe6cd",
    name: "Pertukaran Pelajar",
    description: "Program pertukaran pelajar dengan universitas luar negeri",
    start_period: "2025-08-15T00:00:00Z",
    months_duration: 6,
    activity_type: "WFO",
    location: "Tokyo, Japan",
    web_portal: "https://exchange-program.edu",
    academic_year: "2024/2025",
    program_provider: "Tokyo University",
    approval_status: "APPROVED",
    submitted_by: "student123@example.com",
    submitted_user_role: "MAHASISWA",
    program_type: "Pertukaran Pelajar",
    level: "International",
    group: "FTIK",
    matching: null,
  },
  {
    id: "e2d3c4b5-a678-90f1-e2d3-c4b5a67890f1",
    program_type_id: "c5432198-7654-321a-bcde-f54321987654",
    level_id: "891e2d3c-4b5a-6789-0f1e-2d3c4b5a678",
    group_id: "c0fe616a-99e0-45b9-8ffd-e27407ffe6cd",
    name: "Riset Kolaboratif",
    description: "Program riset kolaboratif dengan industri",
    start_period: "2025-07-01T00:00:00Z",
    months_duration: 8,
    activity_type: "Hybrid",
    location: "Bandung",
    web_portal: "https://research-collab.edu",
    academic_year: "2024/2025",
    program_provider: "PT Telkom Indonesia",
    approval_status: "APPROVED",
    submitted_by: "researcher@example.com",
    submitted_user_role: "DOSEN",
    program_type: "Riset",
    level: "National",
    group: "FTIK",
    matching: null,
  },
  {
    id: "d3c4b5a6-7890-f1e2-d3c4-b5a67890f1e2",
    program_type_id: "d6543219-8765-432a-bcde-f65432198765",
    level_id: "991e2d3c-4b5a-6789-0f1e-2d3c4b5a678",
    group_id: "d0fe616a-00e0-45b9-8ffd-e27407ffe6cd",
    name: "Proyek Sosial",
    description: "Program pengabdian masyarakat",
    start_period: "2025-06-15T00:00:00Z",
    months_duration: 3,
    activity_type: "WFO",
    location: "Malang",
    web_portal: "https://social-project.edu",
    academic_year: "2024/2025",
    program_provider: "Yayasan Peduli Sesama",
    approval_status: "APPROVED",
    submitted_by: "volunteer@example.com",
    submitted_user_role: "MAHASISWA",
    program_type: "Pengabdian Masyarakat",
    level: "Regional",
    group: "FMIPA",
    matching: null,
  },
]

// Mock subjects data
const mockSubjects: Subject[] = [
  {
    id: "98504a5f-58de-4072-90b6-0a5784184af9",
    subject_id: "ebdbff93-2f95-403f-ad91-57b1ed6bbea9",
    kode: "EF234722",
    mata_kuliah: "Magang 2",
    semester: "GANJIL",
    prodi_penyelenggara: "S-1 Teknik Informatika",
    sks: 6,
    kelas: "mbkm",
    departemen: "Teknik Informatika",
    tipe_mata_kuliah: "pilihan prodi",
    documents: [],
  },
  {
    id: "f9c710b9-5348-4d13-a8f9-43c4831422cb",
    subject_id: "f92b580f-d9df-4211-817f-f97c5b20887f",
    kode: "EF234723",
    mata_kuliah: "Sistem Basis Data",
    semester: "GANJIL",
    prodi_penyelenggara: "S-1 Teknik Informatika",
    sks: 6,
    kelas: "mbkm",
    departemen: "Teknik Informatika",
    tipe_mata_kuliah: "pilihan prodi",
    documents: [],
  },
  {
    id: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
    subject_id: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
    kode: "EF234724",
    mata_kuliah: "Pemrograman Web",
    semester: "GENAP",
    prodi_penyelenggara: "S-1 Teknik Informatika",
    sks: 4,
    kelas: "mbkm",
    departemen: "Teknik Informatika",
    tipe_mata_kuliah: "wajib",
    documents: [],
  },
  {
    id: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
    subject_id: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
    kode: "EF234725",
    mata_kuliah: "Kecerdasan Buatan",
    semester: "GANJIL",
    prodi_penyelenggara: "S-1 Teknik Informatika",
    sks: 3,
    kelas: "regular",
    departemen: "Teknik Informatika",
    tipe_mata_kuliah: "pilihan",
    documents: [],
  },
  {
    id: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
    subject_id: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
    kode: "EF234726",
    mata_kuliah: "Jaringan Komputer",
    semester: "GENAP",
    prodi_penyelenggara: "S-1 Teknik Informatika",
    sks: 4,
    kelas: "mbkm",
    departemen: "Teknik Informatika",
    tipe_mata_kuliah: "wajib",
    documents: [],
  },
]

// Fetch activities
export async function fetchActivities(): Promise<Activity[]> {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities)
    }, 1000)
  })
}

// Fetch subjects
export async function fetchSubjects(): Promise<Subject[]> {
  console.log("fetchSubjects called");
  
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        console.log("Mock subjects data:", mockSubjects);
        if (!mockSubjects || mockSubjects.length === 0) {
          console.warn("No subjects available in mock data");
        }
        
        // Make a deep copy to avoid reference issues
        const subjectsCopy = JSON.parse(JSON.stringify(mockSubjects));
        console.log("Returning subjects:", subjectsCopy);
        resolve(subjectsCopy);
      } catch (error) {
        console.error("Error in fetchSubjects:", error);
        reject(error);
      }
    }, 800)
  })
}

// Create a new subject
export async function createSubject(subject: Subject): Promise<Subject> {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSubject: Subject = {
        ...subject,
        id: `subject_${Date.now()}`,
        subject_id: `subject_${Date.now()}`,
      }

      // In a real app, you would add this to your database
      mockSubjects.push(newSubject)

      resolve(newSubject)
    }, 1000)
  })
}

// Create matching between activity and subjects
export async function createMatching(matchingRequest: MatchingRequest): Promise<{success: boolean, message: string}> {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { activity_id, subject_id } = matchingRequest

        // Find the activity
        const activityIndex = mockActivities.findIndex((a) => a.id === activity_id)
        if (activityIndex === -1) {
          throw new Error("Activity not found")
        }

        // Find the subjects
        const matchedSubjects = subject_id.map((id) => {
          const subject = mockSubjects.find((s) => s.subject_id === id)
          if (!subject) {
            throw new Error(`Subject with ID ${id} not found`)
          }
          return subject
        })

        // Update the activity with the matched subjects
        mockActivities[activityIndex] = {
          ...mockActivities[activityIndex],
          matching: matchedSubjects,
        }

        resolve({ success: true, message: "Matching created successfully" })
      } catch (error) {
        reject(error)
      }
    }, 1200)
  })
}
