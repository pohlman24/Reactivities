# Goal 
- implement a follower features
- will use a self referencing many-to-many relaionship which is tricky 

# Creating a Join table
- table will be list of every observer who is following a target 
    - ObserverId -> TargetId === that observer user id is following the target user id
    
- target = gets followed / follow-e
- observer = follow other users / follower

# DataContext
- create new set
- configure many-to-many table 

# Meditor/ Controller
- basic meditor set up and controller setup

# update profile 
- profile needs to return the following and followers info
- Following: is the current logged in user following this user
- follower and followers count

## Update mapper


# UI 
- generic UI making 
- update the agent with new API calls
- update the stores 
    - create helper function in the activityStore 
    - update the profile store 
- created a FollowButton component so that it can handle the submit properly (preventing the default) and because we reuse it a few times
- update the old hard coded values 
## Profile Store
- create an activeTab property that will keep track of which profile tab the user has selected
    - need this because we are using the same component for the Following and Followers tab but need to know which to show
- use a reaction in the profileStore so that whenever the activeTab changes it will run the code so we know which tab the user is in 