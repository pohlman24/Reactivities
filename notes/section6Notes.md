### Lesson Goal
- introduce MobX in this section to help manage state so we arent passing as many props to and from components 
- other choices: Redux is the biggest (i think)
    - why mobX: written in typescript and its really simple 

### WHY 
- right now we are funneling a lot of props from the App.tsx to all other components and its messy and kinda a pain to keep passing props to props to props
- with Mobx and other state management systems we can declare all the props and functions related to the props in a centralized store 
  that can be accessed by all other componenets by using our custom hook `useStore()`

### Mobx terminology 
- action: set
- computed property: get
- obserable: property / watch changes in values

### Set Up
- the store is a basic class
- define all properties that were previously props/states 
- set up constructor using this notation for the system to implicitly declare everything as an action, computed or obserable
```
constructor() 
{
    makeAutoObservable(this)
}
```
- every 'handle' function that was in the app.tsx file can be removed and recreated in the store
-   use to use arrow functions else we need to explicitly delcare the .bound to each property


### Use
- now you can call the activityStore in each componenet when you need to access the varibles using the custom hook and defactoring it 
- in the componenet, if it refers to a property from the store, it needs to be wrapped in the obserable() function


