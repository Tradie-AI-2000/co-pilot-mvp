#!/bin/bash

# Check if adk is in PATH
if command -v adk &> /dev/null; then
    echo "✅ adk is installed and in PATH."
    adk --version
    exit 0
fi

# Check common python bin locations
POSSIBLE_PATHS=(
    "/Library/Frameworks/Python.framework/Versions/3.13/bin/adk"
    "$HOME/.local/bin/adk"
    "/usr/local/bin/adk"
)

for path in "${POSSIBLE_PATHS[@]}"; do
    if [ -f "$path" ]; then
        echo "✅ adk found at $path"
        "$path" --version
        echo "⚠️  Suggestion: Add $(dirname "$path") to your PATH."
        exit 0
    fi
done

echo "❌ adk command not found."
echo "Please install it using: pip install google-adk"
exit 1
