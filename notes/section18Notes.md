# GOAL
- add comments to activites with SignalR 

# Basic set up 
- create new Domain entitiy 
- add DbSet 
- update relationship map 

# DTO 
- need to create a DTO because we dont want to give the user all the info from the entity and want to provide some extra details
    - will need to create a map for it in our mapping profile

# Command handler
- need our server to return the id for our comment since our client cant so we have the command return an object
    - want to get the user properties that shape the comment data that we are returning???? 
        - we are using the returned comment in the signalR api-- specfically the recieveComment which is being using in the client to render the comments

## SignalR Part

# API 
- create new folder and class for it that inherits the Hub class
- Chathub will look similar to regular controller and will use meditor still
- will use `Clients` to acccess connected Clients and can determine the broadness 
- will use `Group` and make a group based on activityID and name the reponse
- need to include function for when users join 
    - they will join the open group based on the httpContext query string 
    - add them to group with `Groups.AddToGroupAsync` and then get the list of comments and send it to them -- name resposne 

# Program/Service
- need to add the SignalR service and update our Cors policy to allow crendials
- update our Program file to tell it where the hub endpoint is: `/chat`

# Authentication 
- cant use tradional authentication so have to use the headers and update the identityService extension 
```
opt.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context => 
                            {
                                // get token from querty string 
                                var accessToken = context.Request.Query["access_token"];
                                // get url path and then check if its the path to the chat app
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                                {
                                    context.Token = accessToken;
                                } 
                                return Task.CompletedTask;
                            }
                        };
```

## Client side

- create model
- create Store

# CommentStore
- install microsoft/signalr package from npm 
- two obserables are `comments: ChatComment[]; hubConnction: HubConnection`
- use the hubConnection to create function to connect to and handle hub interactio n
    - see store for how
    - create handlers that will use the ChatHub.cs methods created
        - while connecting to hub, want to load all commments so use `hubConnection.on(*name of function made in ChatHub.cs*)`
        - need to include the method to add comment
- create function to stop connection 
- create function to clear comments 

# Update Components
- nothing too crazy, just update componets to use the functions form the store as you would
