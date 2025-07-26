#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { seedData } from '../src/lib/seed-data'
import { ElementType } from '../src/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function seedDatabase() {
  console.log('Starting database seeding...')
  
  try {
    // Clear existing data
    console.log('Clearing existing generation_elements...')
    const { error: deleteError } = await supabase
      .from('generation_elements')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records
    
    if (deleteError) {
      console.error('Error clearing existing data:', deleteError)
      process.exit(1)
    }
    
    // Insert seed data
    const insertPromises = Object.entries(seedData).map(async ([type, items]) => {
      console.log(`Seeding ${items.length} ${type} elements...`)
      
      const records = items.map(content => ({
        type: type as ElementType,
        content,
        active: true
      }))
      
      const { error } = await supabase
        .from('generation_elements')
        .insert(records)
      
      if (error) {
        console.error(`Error seeding ${type}:`, error)
        throw error
      }
      
      return items.length
    })
    
    const results = await Promise.all(insertPromises)
    const totalInserted = results.reduce((sum, count) => sum + count, 0)
    
    console.log(`✅ Successfully seeded ${totalInserted} generation elements`)
    
    // Verify the data
    const { count } = await supabase
      .from('generation_elements')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ Database now contains ${count} generation elements`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedDatabase()
}