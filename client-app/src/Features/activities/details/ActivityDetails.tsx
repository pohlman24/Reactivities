import { Button, Card, Image } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore

    // just to remove errors bc typescript thinks that it could be undefined even though we check for that in the activityDashboard
    if(!activity) return <LoadingComponent />;

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
                    <Button basic color="blue" content="Edit" onClick={() => openForm(activity.id)}/>
                    <Button basic color="grey" content="Cancel" onClick={() => cancelSelectedActivity()}/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
