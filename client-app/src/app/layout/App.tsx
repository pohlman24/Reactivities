import { useState, useEffect } from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // connect to api at load using axios 
  useEffect(() => {
    agent.Activities.list().then(response => 
      {
        let activities: Activity[] = [];
        response.forEach(activity => 
          {
            activity.date = activity.date.split('T')[0];
            activities.push(activity);
          })
        setActivities(activities)
        setLoading(false)
      })
  }, [])

  // retrieves activity based on id, gets passed to Activitylist and onClick function to display on right side of screen
  function handleSelectActivity(id: string)
  {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  // sets the activity to undefined, gets passed to ActivityList and onClick funciton to hide current selectedActivity
  function handleCancelSelectActivity()
  {
    setSelectedActivity(undefined)
  }

  // sets editMode for input field popup. if id is passed (editing) then pass that id
  function handleFormOpen(id?: string)
  {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  // disable editmode to hide form 
  function handleFormClose()
  {
    setEditMode(false);
  }
  
  // manages to data changes if user creates or edits activity
  function handleCreateOrEditActivity(activity: Activity)
  {
    setSubmitting(true)
    if(activity.id)
    {
      agent.Activities.update(activity).then(() =>
      {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity)
        setEditMode(false)
        setSubmitting(false)
      })
    }
    else
    {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => 
      {
        setActivities([...activities, activity])
        setSelectedActivity(activity)
        setEditMode(false)
        setSubmitting(false)
      })
    }
  }

  function handleDetete(id: string)
  {
    setSubmitting(true)
    agent.Activities.delete(id).then(() =>
    {
      setActivities([...activities.filter(x => x.id !==id)])
      setSubmitting(false)
    })
    
  }


  if(loading) return <LoadingComponent content='loading App' />

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}} >
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}  
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDetete}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
