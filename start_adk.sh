#!/bin/bash
# Load .env.local manually
if [ -f .env.local ]; then
  # Export vars, ignoring comments, and map specific ones
  export $(grep -v '^#' .env.local | xargs)
fi

# 🔑 CRITICAL KEY MAPPING 🔑
# The agents expect standard SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
# But Next.js uses NEXT_PUBLIC_...
export SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
# We assume the user put the service role key in .env.local as SUPABASE_SERVICE_ROLE_KEY
# If not, we might fallback to ANON (which will fail for admin tasks, but works for connection)
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    export SUPABASE_SERVICE_ROLE_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo "⚠️  WARNING: Using ANON KEY for Agents. Admin tasks may fail RLS."
fi

export GOOGLE_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY
export PYTHONPATH=$(pwd)/agents-swarm

echo "🚀 Starting ADK Web Server..."
echo "   - Supabase: $SUPABASE_URL"
echo "   - Google AI: Configured"

/Library/Frameworks/Python.framework/Versions/3.13/bin/adk web agents-swarm --port 8000 --host 0.0.0.0