@echo off
docker-compose rm -sf db
docker-compose up --build -d pgadmin db
echo Starting database and admin panel...
timeout 3 /nobreak > nul
docker-compose logs db
echo.
echo Check the startup log above.
echo Press any key to exit. Containers will keep running if started correctly.
pause > nul