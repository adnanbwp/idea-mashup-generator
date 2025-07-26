import { NextRequest, NextResponse } from 'next/server'
import { generateSingleIdea } from '@/lib/generator'
import { GenerateIdeaResponse, ApiError } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const ideaContent = await generateSingleIdea()
    
    const response: GenerateIdeaResponse = {
      id: crypto.randomUUID(),
      content: ideaContent
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error generating idea:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'GENERATION_FAILED',
        message: 'Failed to generate idea',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}