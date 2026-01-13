#!/bin/bash

# Test Script for Google Authentication (Mock Mode)
# Pre-requisite: Server must be running with NODE_ENV=development

echo "Testing Google Auth with Mock Token..."
echo "Ensure your server is running: NODE_ENV=development npm start"
echo "---------------------------------------------------"

# 1. Test Valid Mock Token
echo "1. Sending Valid Mock Token (Should Succeed)..."
curl -v -X POST http://localhost:4000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"googleToken": "mock_valid"}'

echo -e "\n---------------------------------------------------"

# 2. Test Invalid Domain (Simulated)
# Note: To test actual domain rejection, we'd need to modify the mock logic in controller temporarily,
# but this script tests the Endpoint availability and Token parsing.

echo "Done. If you see a 'token' and 'user' object above, Auth is working."
