/**
 * @jest-environment node
 */
import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock the generator module
jest.mock('@/lib/generator', () => ({
  generateSingleIdea: jest.fn(() => Promise.resolve({
    persona: 'Test Persona',
    problem: 'Test Problem',
    technology: 'Test Technology',
    businessModel: 'Test Business Model',
    generatedAt: '2023-12-01T10:00:00Z',
    description: 'Test description'
  }))
}))

describe('/api/ideas/generate', () => {
  it('generates an idea successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/ideas/generate', {
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('content')
    expect(data.content).toHaveProperty('persona', 'Test Persona')
    expect(data.content).toHaveProperty('problem', 'Test Problem')
    expect(data.content).toHaveProperty('technology', 'Test Technology')
    expect(data.content).toHaveProperty('businessModel', 'Test Business Model')
  })
  
  it('handles generation errors gracefully', async () => {
    // Mock a failed generation
    const { generateSingleIdea } = require('@/lib/generator')
    generateSingleIdea.mockRejectedValueOnce(new Error('Generation failed'))
    
    const request = new NextRequest('http://localhost:3000/api/ideas/generate', {
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data.error.code).toBe('GENERATION_FAILED')
    expect(data.error.message).toBe('Failed to generate idea')
  })
})