import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ApiError } from '@/types'

// Delete an idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing idea ID'
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
    
    // Delete the idea (RLS will ensure users can only delete their own ideas)
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      message: 'Idea deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting idea:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete idea',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}