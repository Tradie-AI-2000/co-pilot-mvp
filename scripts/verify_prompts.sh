#!/bin/bash
# Verify Agent Prompts

API_URL="http://localhost:3000/api/agent"
CONTEXT=$(cat mock_context.json)

echo "🥒 Pickle Rick Agent Auditor 🥒"
echo "================================="

run_test() {
    AGENT=$1
    MESSAGE=$2
    echo "Testing Agent: $AGENT"
    echo "Message: $MESSAGE"
    
    # Construct JSON payload properly
    # Using jq to insert the context object safely
    PAYLOAD=$(jq -n \
                  --arg agent "$AGENT" \
                  --arg msg "$MESSAGE" \
                  --argjson ctx "$CONTEXT" \
                  '{agentId: $agent, message: $msg, context: $ctx}')

    RESPONSE=$(curl -s -X POST "$API_URL" -d "$PAYLOAD" -H "Content-Type: application/json")
    
    # Extract chat_response
    CHAT_RESPONSE=$(echo "$RESPONSE" | jq -r '.chat_response')
    
    echo "--- Response ---"
    echo "$CHAT_RESPONSE" | head -n 10 # Show first 10 lines
    echo "..."
    echo "----------------"
    echo ""
}

# 1. Jarvis Triggers
run_test "jarvis" "Give me a desk pulse. #desk-pulse"
run_test "jarvis" "Run crisis interceptor. #crisis-interceptor"
run_test "jarvis" "Run rainmaker protocol. #rainmaker"
run_test "jarvis" "Audit the desk. #audit-desk"
run_test "jarvis" "Generate strategic report. #strategic-report"
run_test "jarvis" "Analyze client demand. #client-demand"
run_test "jarvis" "Check migrant workforce status. #migrant-workforce"

# 2. Negotiator
run_test "negotiator" "Client offering $45 for Carpenter. #rate-defense"

# 3. Compliance
run_test "compliance" "Check visas. #visa-check"

# 4. Scout
run_test "scout" "Find me a finishing carpenter."
