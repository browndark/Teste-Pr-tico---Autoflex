@echo off
cd backend
echo Building backend...
mvn clean package -DskipTests -q -Pnative -Dquarkus.native.native-image-xmx=2g
echo.
echo Backend built. Starting on port 8082...
java -jar target/quarkus-app/quarkus-run.jar
pause
