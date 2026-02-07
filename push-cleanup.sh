#!/bin/bash

#
# Git Force Push Script for node_modules Cleanup
# Usage: Run this from Git Bash
#

echo "=========================================="
echo "Git Force Push - node_modules Cleanup"
echo "=========================================="
echo ""

cd "c:/Users/Public/Workspace/quest hands"

echo "Current status:"
git log --oneline -3
echo ""

echo "Pushing to GitHub..."
echo "(This will rewrite the remote history)"
echo ""

git push -u origin master --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Repository pushed to GitHub"
    echo ""
    echo "Verify at: https://github.com/browndark/Teste-Prático---Autoflex"
    echo "Check the Languages tab - should now show accurate percentages"
else
    echo ""
    echo "❌ FAILED - Try:"
    echo "   1. Restart Git Bash and try again"
    echo "   2. Check GitHub credentials"
    echo "   3. Verify internet connection"
fi

echo ""
echo "=========================================="
