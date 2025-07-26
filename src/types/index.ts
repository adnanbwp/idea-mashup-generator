// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string
  content: IdeaContent
  created_at: string
  updated_at: string
}

export interface IdeaContent {
  persona: string
  problem: string
  technology: string
  businessModel: string
  format?: string
  generatedAt: string
  description?: string
}

export interface GenerationElement {
  id: string
  type: ElementType
  content: string
  active: boolean
  created_at: string
}

export type ElementType = 
  | 'persona' 
  | 'problem' 
  | 'technology' 
  | 'format'
  | 'business_model'
  | 'channel'
  | 'action_verb'
  | 'trend'

// API response types
export interface GenerateIdeaResponse {
  id: string
  content: IdeaContent
}

export interface GetIdeasResponse {
  ideas: Idea[]
  total: number
}

export interface SaveIdeaRequest {
  content: IdeaContent
}

export interface SaveIdeaResponse {
  id: string
  message: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: object
  }
  timestamp: string
}

// Component props types
export interface IdeaCardProps {
  idea: Idea
  onDelete?: (id: string) => void
}

export interface GeneratorProps {
  onIdeaGenerated?: (idea: IdeaContent) => void
}