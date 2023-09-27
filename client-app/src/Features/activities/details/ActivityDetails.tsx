import { Button, Card, Image } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

export default observer(function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInital} = activityStore
    const {id} = useParams();
    
    useEffect(() => 
    {
        if(id)
        {
            loadActivity(id)
        }
    }, [id, loadActivity])

    // just to remove errors bc typescript thinks that it could be undefined even though we check for that in the activityDashboard
    if(loadingInital || !activity) return <LoadingComponent />;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group>
                    <Button basic color="blue" content="Edit" as={Link} to={`/manage/${activity.id}`}/>
                    <Button basic color="grey" content="Cancel" as={Link} to={`/activities`} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})
