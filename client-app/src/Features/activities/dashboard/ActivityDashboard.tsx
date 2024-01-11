import { Grid } from "semantic-ui-react"
import ActivityList from "./ActivityList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import ActivityFilters from "./ActivityFilters"

export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {loadActivites, activityRegistry} = activityStore;
    
    // connect to api at load using axios 
    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivites();
    }, [loadActivites, activityRegistry.size])
    
  
    if(activityStore.loadingInital) return <LoadingComponent content='Loading activities...' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})