#!/bin/bash

BASE_URL="http://localhost:3001"

echo "=== Testing AI Fitness Coach APIs ==="
echo ""

# Test 1: Generate Plan
echo "1. Testing /api/generate-plan"
curl -X POST "$BASE_URL/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "height": 180,
    "weight": 85,
    "goal": "muscle gain",
    "level": "intermediate",
    "location": "gym",
    "dietaryPrefs": ["no-dairy"],
    "medicalHistory": "none"
  }' 2>/dev/null | jq . || echo "Failed"
echo ""

# Test 2: Generate Image
echo "2. Testing /api/generate-image"
curl -X POST "$BASE_URL/api/generate-image" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "person doing barbell squats in gym"}' 2>/dev/null | jq . || echo "Failed"
echo ""

# Test 3: Speak (TTS)
echo "3. Testing /api/speak"
curl -X POST "$BASE_URL/api/speak" \
  -H "Content-Type: application/json" \
  -d '{"section": "motivation", "text": "You got this! Push hard and stay consistent."}' 2>/dev/null | jq . || echo "Failed"
echo ""

echo "=== API Tests Complete ==="
