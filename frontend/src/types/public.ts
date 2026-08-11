export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  requirements: string | null;
  documents: string | null;
  price: string | null;
  duration: string | null;
  icon: string | null;
  active: boolean;
  needs_appointment: boolean;
  availability: string | null;
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  image_url: string | null;
  category: string;
  featured: boolean;
  author_name: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  progress: number;
  budget: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  priority: string;
  deadline: string | null;
  attachment_url: string | null;
  author_name: string | null;
  active: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  budget: string | null;
  deadline: string | null;
  requirements: string | null;
  documents: string | null;
  contact_info: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

export interface Complaint {
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  description: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  date: string;
  created_at: string;
}