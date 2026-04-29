import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uuzodugbltmxxfjgilpy.supabase.co'
const supabaseKey = 'sb_publishable_6cZVPVFYFbS6GvxdOv_LZQ_DJa1A_t_'

export const supabase = createClient(supabaseUrl, supabaseKey)