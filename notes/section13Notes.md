# Client side login 

- create new model interface for the user, should resemable the C# one
    - will also need to create a model for userFormValues, these will be passed from the form to the login function
- create form for signing in

# Update Agent
- need to add new actions for the user Account
    - Login, Register, Current, 
        - these will use the userFormValues model
- add request interceptor to send up the token as a header with the bearer

# Create User Store
- create the login, logout, getUser methods that will use the agent.ts


# Update Common Store
- the common store will now also handle getting and setting the token in local memory 


# dependencies Order:
- UserFormValues
    - Form
        - userStore
            - agent
            
# Request summary
when form is submitted, calls the userStore login function which takes a userFormValue and that will call the agent login function which will call the API to login with the user creds 