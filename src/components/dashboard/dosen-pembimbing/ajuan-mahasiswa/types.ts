export interface Document {
  id: string
  name: string
  document_type: string
  url?: string
  file_path?: string
  registration_id?: string
  file_storage_id?: string
}

export interface Registration {
  id: string
  activity_id: string
  user_id: string
  activity_name: string
  lo_validation: string
  user_name: string
  user_nrp: string
  semester: string | number
  total_sks: number
  academic_advisor: string
  academic_advisor_email: string
  academic_advisor_validation: string
  advising_confirmation: boolean
  mentor_name: string
  mentor_email: string
  documents: Document[]
} 