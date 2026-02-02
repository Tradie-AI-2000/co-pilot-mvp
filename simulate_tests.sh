#!/bin/bash
# Load .env.local manually
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Map keys for ADK
export GOOGLE_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY
export SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
export SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
export PYTHONPATH=$(pwd)/agents-swarm

ADK_BIN="/Library/Frameworks/Python.framework/Versions/3.13/bin/adk"

run_test() {
    local agent=$1
    local prompt=$2
    echo "----------------------------------------------------"
    echo "TESTING AGENT: $agent"
    echo "PROMPT: $prompt"
    echo "----------------------------------------------------"
    (echo "$prompt"; sleep 15; echo "exit") | $ADK_BIN run agents-swarm/$agent
    echo -e "\n"
}

# 1. GM
run_test "stellar_gm" "GM, give me a quick executive summary of the business health right now. Are we hitting our margin targets?"

# 2. Accountant (The Fix)
run_test "stellar_accountant" "Audit my current placements. What is our total weekly payroll liability including the 1.30 burden?"

# 3. CandidateMgr (Squad Logic)
run_test "stellar_candidate_mgr" "I have a new site in Auckland. Can you build a squad for me?"

# 4. SalesLead
run_test "stellar_sales_lead" "Audit my Tier 1 clients for decay."