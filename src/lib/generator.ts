import { supabase } from './supabase'
import { ElementType, IdeaContent, GenerationElement } from '@/types'

export interface GenerationConfig {
  includeFormats?: boolean
  includeChannels?: boolean
  includeActionVerbs?: boolean
  includeTrends?: boolean
}

const DEFAULT_CONFIG: GenerationConfig = {
  includeFormats: true,
  includeChannels: false,
  includeActionVerbs: true,
  includeTrends: true,
}

async function getRandomElement(type: ElementType): Promise<string> {
  // First, get all elements of this type
  const { data, error } = await supabase
    .from('generation_elements')
    .select('content')
    .eq('type', type)
    .eq('active', true)
  
  if (error) {
    console.error(`Error fetching ${type}:`, error)
    throw new Error(`Failed to fetch ${type} element`)
  }
  
  if (!data || data.length === 0) {
    throw new Error(`No active ${type} elements found`)
  }
  
  // Pick a random element client-side
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex].content
}

async function getMultipleRandomElements(types: ElementType[]): Promise<Record<ElementType, string>> {
  const promises = types.map(async (type) => {
    const element = await getRandomElement(type)
    return [type, element] as [ElementType, string]
  })
  
  const results = await Promise.all(promises)
  return Object.fromEntries(results) as Record<ElementType, string>
}

function generateIdeaDescription(elements: Record<string, string>): string {
  const { persona, problem, technology, business_model, format, action_verb, trend } = elements
  
  let description = `For ${persona.toLowerCase()}, who struggle with ${problem.toLowerCase()}, `
  
  if (format) {
    description += `we're building a ${format.toLowerCase()} `
  } else {
    description += `we're building a solution `
  }
  
  description += `using ${technology} `
  
  if (action_verb) {
    description += `that ${action_verb.toLowerCase()}s their workflow `
  }
  
  description += `with a ${business_model.toLowerCase()} model`
  
  if (trend) {
    description += `, focusing on ${trend.toLowerCase()} principles`
  }
  
  description += '.'
  
  return description
}

export class IdeaMashupGenerator {
  private config: GenerationConfig
  
  constructor(config: GenerationConfig = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }
  
  async generateIdea(): Promise<IdeaContent> {
    try {
      // Core elements (always included)
      const coreTypes: ElementType[] = ['persona', 'problem', 'technology', 'business_model']
      
      // Optional elements based on config
      const optionalTypes: ElementType[] = []
      if (this.config.includeFormats) optionalTypes.push('format')
      if (this.config.includeChannels) optionalTypes.push('channel')
      if (this.config.includeActionVerbs) optionalTypes.push('action_verb')
      if (this.config.includeTrends) optionalTypes.push('trend')
      
      const allTypes = [...coreTypes, ...optionalTypes]
      const elements = await getMultipleRandomElements(allTypes)
      
      const ideaContent: IdeaContent = {
        persona: elements.persona,
        problem: elements.problem,
        technology: elements.technology,
        businessModel: elements.business_model,
        format: elements.format,
        generatedAt: new Date().toISOString(),
        description: generateIdeaDescription(elements)
      }
      
      return ideaContent
      
    } catch (error) {
      console.error('Error generating idea:', error)
      throw new Error('Failed to generate idea')
    }
  }
  
  async generateMultipleIdeas(count: number): Promise<IdeaContent[]> {
    const promises = Array.from({ length: count }, () => this.generateIdea())
    return Promise.all(promises)
  }
}

// Default generator instance
export const defaultGenerator = new IdeaMashupGenerator()

// Utility functions
export async function generateSingleIdea(config?: GenerationConfig): Promise<IdeaContent> {
  const generator = new IdeaMashupGenerator(config)
  return generator.generateIdea()
}

export async function generateBatchIdeas(count: number, config?: GenerationConfig): Promise<IdeaContent[]> {
  const generator = new IdeaMashupGenerator(config)
  return generator.generateMultipleIdeas(count)
}