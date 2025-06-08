import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkhjbgizllnjvxogatvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraGpiZ2l6bGxuanZ4b2dhdHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzU5MzMsImV4cCI6MjA2NDkxMTkzM30.DPeWLiqZ22USQmksnLBexJQ4X4KmdqSEaeE_HebYL_A';

export const supabase = createClient(supabaseUrl, supabaseKey);
