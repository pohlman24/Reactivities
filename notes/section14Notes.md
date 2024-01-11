# Goal 
- create link between users and activities with many to many table

# Domain
- will need to createa a join table which will be a new domain entity 
- will contain the foreign keys to both activity and AppUser as well as the object itself and the isHost bool

- need to also add foreign key to the activity and AppUser table as well. 
    - Activiity : `ICollection<ActivityAttendee> Attendees { get; set; }`
    - AppUser : `ICollection<ActivityAttendee> Activities { get; set; }`

# DataContext
- add new model DbSet `public DbSet<ActivityAttendee> ActivityAttendees { get; set; }`
- add OnModelBuilder boilerplate and configure relationships in it

## need to access our users inside our application project (meditor) 
- create new class `dotnet new classlib -n Infrastucuture`
- add to solution `dotnet sln add .\Infrastucuture\`
- within the folder add reference to application `dotnet add reference ..\Application\`
- in API add reference to infrastucuture `dotnet add reference ..\Infrastucuture\`

# Interfaces
- want to access the service from inside app project but it does not have a dependency on the infrasutucure projcet
so we will create an interface in our app project for it
- define the class implmentation in the infrastrucure proj 

# Service Extension
- need to add the UserAccessor and interface so that it will be injected in the application handler
`services.AddScoped<IUserAccessor, UserAccessor>();`

# Loading Related Data W/ Eager loading 
- in order to load related data, ie loading the activities and the attendees asscioated with it
```
 var activities = await _context.Activities
        .Include(a => a.Attendees)
        .ThenInclude(u => u.AppUser)
        .ToListAsync(cancellationToken);
```
- this still wont worok completelty bc its stuck in an infinte loop so because of the nameing of info
    - so we will create a new class called Profiles which contains the props 
    - after that we then create an ActivityDto which is nearly identitcal to the model but the list will be of profiles instead of Attendees


# Create new Handler for joing activity
- will follow similar pattern as with other handlers and API calls

# Adding authorization policy for activity editing protection
- create custom authorization policy before we allow a user to edit a activity
- inside infrastructure/security
- create a class that will extend from `IAuthorizationRequirement`
    - this will be left blank 
- create a class handler for it now  `IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>`
    - will need a ctor that has the dbContext and httpContext `IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)`
    - will also need to include this fucntion `protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)`
        - inside this function is where you define the policy
        - for us we want to make sure only the host can edit an acitivty
            - get user, get activityId, attendee from join table 

