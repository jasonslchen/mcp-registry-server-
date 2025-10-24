#!/bin/bash

echo "🧪 Testing MCP Registry Server"
echo "================================"
echo ""

BASE_URL="http://localhost:8080"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run test
run_test() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -e "${BLUE}Testing:${NC} $name"
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $response"
        ((FAILED++))
    fi
    echo ""
}

# Test 1: Health check
run_test "Health endpoint" "$BASE_URL/health" '"status":"ok"'

# Test 2: List all servers
run_test "List all servers" "$BASE_URL/v0.1/servers" '"count":3'

# Test 3: Search for GitHub server
run_test "Search for GitHub server" "$BASE_URL/v0.1/servers?search=github" 'server-github'

# Test 4: Limit results
run_test "Limit to 2 servers" "$BASE_URL/v0.1/servers?limit=2" '"count":2'

# Test 5: Get specific server - GitHub
run_test "Get GitHub server" "$BASE_URL/v0.1/servers/io.github.modelcontextprotocol/server-github" 'GITHUB_PERSONAL_ACCESS_TOKEN'

# Test 6: Get specific server - Filesystem
run_test "Get Filesystem server" "$BASE_URL/v0.1/servers/io.github.modelcontextprotocol/server-filesystem" 'server-filesystem'

# Test 7: Get specific server - Memory
run_test "Get Memory server" "$BASE_URL/v0.1/servers/io.github.modelcontextprotocol/server-memory" 'server-memory'

# Test 8: 404 error for nonexistent server
run_test "404 for nonexistent server" "$BASE_URL/v0.1/servers/nonexistent" '"error":"Server not found"'

# Summary
echo "================================"
echo -e "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
