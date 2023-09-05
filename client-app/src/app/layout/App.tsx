import { useEffect } from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  // connect to api at load using axios 
  useEffect(() => {
    activityStore.loadActivites();
  }, [activityStore])
  

  if(activityStore.loadingInital) return <LoadingComponent content='Loading App' />

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}} >
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
