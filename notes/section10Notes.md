### Lesson Goal
add error handling for front-end and back-end 

### API empty POST request
- 1 solution is to add the `[required]` data annotation to the entity class
- but this logic doesnt really belong in the domain layer and should be in the application layer

- instead what we will do is install a package called fleuntvalidation 
- add validations to the Application > Activities. could add all to the meditr class but we will create a new file for it and for others to extened from
```
public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }
```
- and inside the command handler classes
```
public class CommandValidtor : AbstractValidator<Command>
        {
            public CommandValidtor()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }
```

### API GET null request 
-- Issue is that it returns a 204 content not found which is a success technically 
- could manage null activities on the controller side by doing checks there but we want to keep a thin client controller
- cant manage on the meditr handler because it doesnt have access to the http stuff
- create a new class in the core folder called Result that will be used for all entities
```
public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }
        public static Result<T> Success(T value) => new Result<T> {IsSuccess = true, Value = value};
        public static Result<T> Failure(string error) => new Result<T> {IsSuccess = false, Error = error};
    }
```
- update details handler to instead return the Result<Acitivtiy> where ever it was Activity
- and update controller 
```
var result = await Mediator.Send(new Details.Query{Id = id});

            if(result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if(result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            return BadRequest();
```

- but we dont want our controllers getting to large and each entity will need these so we will move this to the base api controller and call that function in the ActivitiesController while passing the results to it

## Quick summary 
- to handle POST validations we created the ActivityValidator.cs and use in the command handlers
- to handle GET validatiosn we created a Result object that contains a success and failure method. 
the meditr now returns the result object and the controller now calls the handleResult function from the baseAPIController 

### EXCEPTIONS 
- need to think about what we do in the case of an exception

- we want to create our own expcetions in the Application > Core folder and use this for dev and prod
- we want to show the statusCode, the message and possibly details if in dev mode
- now we to create our own middleware to use. most of it is boilderplate code
--- basically, if no error, move on to next middleware, if error, create statuscode, set message and details and then format for webdisplay

### CLIENT SIDE 
- created mock controller for easier bad request and a mock component that makes the axios API calls to test the error
- install react-toastify for notifications
- created a errors folder for contain all error components 
- add axios interceptors in the agent.ts 