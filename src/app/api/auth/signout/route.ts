import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'
import { ApiError } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await signOut()
    
    return NextResponse.json({
      message: 'Logout successful'
    })
    
  } catch (error: any) {
    console.error('Signout error:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'SIGNOUT_FAILED',
        message: error.message || 'Failed to sign out',
        details: { error: error.message }
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}