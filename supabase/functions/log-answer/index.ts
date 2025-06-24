import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LogAnswerRequest {
  questionId: number
  chosenIndex: 0 | 1 | 2 | 3 | 4
  isCorrect: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the Authorization header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse request body
    const { questionId, chosenIndex, isCorrect }: LogAnswerRequest = await req.json()

    // Validate input
    if (
      typeof questionId !== 'number' ||
      typeof chosenIndex !== 'number' ||
      chosenIndex < 0 ||
      chosenIndex > 4 ||
      typeof isCorrect !== 'boolean'
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Insert answer log
    const { data, error } = await supabaseClient
      .from('answer_logs')
      .insert({
        user_id: user.id,
        question_id: questionId,
        chosen_index: chosenIndex,
        is_correct: isCorrect,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting answer log:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log answer' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})