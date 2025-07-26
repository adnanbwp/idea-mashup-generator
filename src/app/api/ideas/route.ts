import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GetIdeasResponse, SaveIdeaRequest, SaveIdeaResponse, ApiError } from '@/types'

// Get user's saved ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // In a real app, you'd get the user ID from the auth token
    // For now, we'll use a placeholder approach
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      const errorResponse: ApiError = {
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    // TODO: Extract user ID from JWT token
    // For now, using a mock user ID for development
    const userId = 'mock-user-id'
    
    const { data: ideas, error, count } = await supabase
      .from('ideas')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    
    const response: GetIdeasResponse = {
      ideas: ideas || [],
      total: count || 0
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching ideas:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch ideas',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Save a new idea
export async function POST(request: NextRequest) {
  try {
    const body: SaveIdeaRequest = await request.json()
    
    if (!body.content) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required field: content'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    // TODO: Extract user ID from JWT token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      const errorResponse: ApiError = {
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    const userId = 'mock-user-id'
    
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        content: body.content
      })
      .select('id')
      .single()
    
    if (error) {
      throw error
    }
    
    const response: SaveIdeaResponse = {
      id: data.id,
      message: 'Idea saved successfully'
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Error saving idea:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'SAVE_FAILED',
        message: 'Failed to save idea',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}