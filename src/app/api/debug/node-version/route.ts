import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  })
}