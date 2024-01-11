# Adding migration 
dotnet ef migrations add nameOfMigration -p Persistance -s API

# Run API
cd into api folder
dotnet watch --no-hot-reload

# Reset 
dotnet restore/reload 

# Drop Database
dotnet ef database drop -p .\Persistence\ -s .\API\

# SQL lite
ctrl + shift + p >> SQLite openDatabase >> topleft explorer 