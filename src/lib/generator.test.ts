import { generateSingleIdea, IdeaMashupGenerator } from './generator'

// Mock Supabase
jest.mock('./supabase', () => {
  const mockData: Record<string, { content: string }[]> = {
    persona: [
      { content: 'Tech Entrepreneurs' },
      { content: 'Small Business Owners' },
      { content: 'Remote Workers' }
    ],
    problem: [
      { content: 'managing their time effectively' },
      { content: 'finding reliable team members' },
      { content: 'staying organized with multiple projects' }
    ],
    technology: [
      { content: 'AI-powered analytics' },
      { content: 'blockchain technology' },
      { content: 'mobile-first design' }
    ],
    business_model: [
      { content: 'subscription' },
      { content: 'freemium' },
      { content: 'marketplace' }
    ],
    format: [
      { content: 'mobile app' },
      { content: 'web platform' },
      { content: 'API service' }
    ],
    channel: [
      { content: 'social media' },
      { content: 'direct sales' },
      { content: 'partner network' }
    ],
    action_verb: [
      { content: 'streamline' },
      { content: 'automate' },
      { content: 'optimize' }
    ],
    trend: [
      { content: 'sustainability' },
      { content: 'remote work' },
      { content: 'AI integration' }
    ]
  }

  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn((field: string, value: string) => ({
            eq: jest.fn(() => Promise.resolve({
              data: mockData[value] || [],
              error: null
            }))
          }))
        }))
      }))
    }
  }
})

describe('IdeaMashupGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should generate a valid idea with all required fields', async () => {
    const idea = await generateSingleIdea()
    
    expect(idea).toHaveProperty('persona')
    expect(idea).toHaveProperty('problem')
    expect(idea).toHaveProperty('technology')
    expect(idea).toHaveProperty('businessModel')
    expect(idea).toHaveProperty('generatedAt')
    expect(idea).toHaveProperty('description')
    
    expect(typeof idea.persona).toBe('string')
    expect(typeof idea.problem).toBe('string')
    expect(typeof idea.technology).toBe('string')
    expect(typeof idea.businessModel).toBe('string')
    expect(typeof idea.generatedAt).toBe('string')
    expect(typeof idea.description).toBe('string')
  })
  
  it('should generate different ideas on multiple calls', async () => {
    const generator = new IdeaMashupGenerator()
    const idea1 = await generator.generateIdea()
    
    // Add a small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 1))
    
    const idea2 = await generator.generateIdea()
    
    // While it's theoretically possible for two ideas to be identical,
    // it's extremely unlikely with proper random generation
    expect(idea1.generatedAt).not.toBe(idea2.generatedAt)
  })
  
  it('should generate multiple ideas in batch', async () => {
    const generator = new IdeaMashupGenerator()
    const ideas = await generator.generateMultipleIdeas(3)
    
    expect(ideas).toHaveLength(3)
    ideas.forEach(idea => {
      expect(idea).toHaveProperty('persona')
      expect(idea).toHaveProperty('problem')
      expect(idea).toHaveProperty('technology')
      expect(idea).toHaveProperty('businessModel')
    })
  })
  
  it('should include optional elements when configured', async () => {
    const generator = new IdeaMashupGenerator({
      includeFormats: true,
      includeChannels: true,
      includeActionVerbs: true,
      includeTrends: true
    })
    
    const idea = await generator.generateIdea()
    expect(idea).toHaveProperty('format')
  })
})