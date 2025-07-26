import { NextRequest, NextResponse } from 'next/server'
import { GetIdeasResponse, SaveIdeaRequest, SaveIdeaResponse, ApiError } from '@/types'
import { createClient } from '@supabase/supabase-js'

// Get user's saved ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const errorResponse: ApiError = {
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    // Ensure user exists in our users table (auto-create if needed)
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (upsertError) {
      console.error('Error creating/updating user:', upsertError)
      // Continue anyway - the user might already exist
    }
    
    const { data: ideas, error, count } = await supabase
      .from('ideas')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
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
    
    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const errorResponse: ApiError = {
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }
    
    // Ensure user exists in our users table (auto-create if needed)
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (upsertError) {
      console.error('Error creating/updating user:', upsertError)
      // Continue anyway - the user might already exist
    }
    
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
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