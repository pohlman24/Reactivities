### Lesson goal
- add routing from the react-router 

### Why
- React makes SPA (single page application) which only has one .html page that is loaded
    - instead of loading different pages, it loads different components but needs to connect those componenet to url 

### Set up 
- Create new folder and file for the router and route.tsx
- declare your routes in an array of objects
    - each object takes the following values
        1. path: the url path to the componenet 
        2. element: the component that should be loaded when going to path
- the first object is "/" and will be <App />, put all other routes in the children array of this root route 
- in the App.tsx, replace the component with this <Outlet />
- use the `useParams()` hook whenever you pass an id to a route 
- replace onClick events with the `as={Link} to={/path}`