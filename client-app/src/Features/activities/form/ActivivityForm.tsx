import { Segment, Form, Button } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { ChangeEvent, useState } from 'react';

interface Props
{
  activity: Activity | undefined;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
  submitting: boolean;
}

export default function ActivivityForm({activity: selectedActivity, closeForm, createOrEdit, submitting}: Props) {

  // create var to be use to update fields
  // if selectedActivity has a value (editing) then use those values
  const intialState = selectedActivity ?? {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  } 
  
  // init activity var to initialState
  const [activity, setActivity] = useState(intialState);

  function handleSubmit()
  {
    createOrEdit(activity)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
  {
    const {name, value} = event.target;

    setActivity({...activity, [name]: value})
  }

  return (
    <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete='off' >
            <Form.Input placeholder="Title" value={activity.title} name='title' onChange={handleInputChange} />
            <Form.TextArea placeholder="Description" value={activity.description} name='description' onChange={handleInputChange} />
            <Form.Input placeholder="Category" value={activity.category} name='category' onChange={handleInputChange} />
            <Form.Input type='date' placeholder="Date" value={activity.date} name='date' onChange={handleInputChange} />
            <Form.Input placeholder="City" value={activity.city} name='city' onChange={handleInputChange} />
            <Form.Input placeholder="Venue" value={activity.venue} name='venue' onChange={handleInputChange} />
            <Button loading={submitting} floated='right' positive type='submit' content="Submit" />
            <Button floated='right' type='button' content="Cancel" onClick={() => closeForm()} />
        </Form>
    </Segment>
  )
}
