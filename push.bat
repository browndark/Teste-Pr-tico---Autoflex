@echo off
cd "c:\Users\Public\Workspace\quest hands"
git status
echo.
echo Attempting force push to GitHub...
git push -u origin master --force
pause
