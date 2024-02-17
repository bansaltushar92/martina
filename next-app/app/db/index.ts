
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
console.log(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!)

