export interface Activity {
  id: string
  program_type_id: string
  level_id: string
  group_id: string
  name: string
  description: string
  start_period: string
  months_duration: number
  activity_type: string
  location: string
  web_portal: string
  academic_year: string
  program_provider: string
  approval_status: string
  submitted_by: string
  submitted_user_role: string
  program_type: string
  level: string
  group: string
  matching: Subject[] | null
}

export interface Subject {
  id: string
  subject_id: string
  kode: string
  mata_kuliah: string
  semester: string
  prodi_penyelenggara: string
  sks: number
  kelas: string
  departemen: string
  tipe_mata_kuliah: string
  documents: Document[] 
}

export interface Document {
  id: string
  document_type: string
  file_storage_id: string
  name: string
  subject_id: string
}

export interface ActivityData {
  message: string
  status: string
  data: Activity[]
  current_page: number
  first_page_url: string
  last_page: number
  last_page_url: string
  next_page_url: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
  total_pages: number
  total_approval_data: { approval_status: string; total: number }[]
}

export interface MatchingRequest {
  activity_id: string
  subject_id: string[]
}
