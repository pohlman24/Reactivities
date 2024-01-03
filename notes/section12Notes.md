# GOAL
- add user identity class and allow users to make accounts 

# Set up 
- with NuGet Gallery add 'microsoft.entityframeworkcore.identity' so that we can use their premade identity handling 

# Domain / AppUser
- create new class AppUser that extends from the IdentityUser class 
- will have a lot of premade properties but we will want to add our own Bio and display name props

# Data Context 
- instead of using dbContext will we will now use `IdentityDbContext<AppUser>`
- add migration with `dotnet ef migrations add description -p .\Persistance\ -s API`

# Services 
- need to add the identity services but it is quite a lot so we will create a new service extention class just for it
- add boilerplate code 
- add `AddAuthentication` service
- add `AddIdentityCore<AppUser>` and add password requirements
- add `.AddEntityFrameworkStores<DataContext>();`service

# Seed Data
- use the `UserManager<AppUser>` to manage creating new users 
- add seed to the program.cs file

# DTOs
- data transfer object: object carrying data between process
- one process is the client and the user submitting a form and its going to trasmit some data to our API and we want to recieve that data 
    - to help the controllers bind infomation coming from the http request, we create DTOs

# Json Web tokens (Jwt) 
- a lot of 'boiler plate' code
- create TokenSerivce.cs to handle creating a token for the users
- need to install a couple of nugut packages

# Account Controller 
- will use controllerBase instead of extending 
- need to get TokenServide for DI and AppUser

IdentitySerivceExntension 
modify program.cs
