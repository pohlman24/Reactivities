import { Segment, Button, Header } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Formik, Form } from 'formik';
import {v4 as uuid} from 'uuid'
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/category';
import MyDateInput from '../../../app/common/form/MyDateInput';




export default observer(function ActivivityForm() {
  const {activityStore} = useStore();
  const {loading, loadActivity, loadingInital, createActivity, updateActivity} = activityStore;
  const {id} = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: ''
  })
  
  const validationScheme = Yup.object({
	title: Yup.string().required('The activity title is required'),
	description: Yup.string().required('The activity description is required'),
	category: Yup.string().required(),
	date: Yup.string().required("Date is required"),
	venue: Yup.string().required(),
	city: Yup.string().required(),

  })

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!))
  }, [id, loadActivity])
  
  function handleFormSubmit(activity: Activity)
  {
    if (!activity.id)
    {
      activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
    else
    {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if(loadingInital) return <LoadingComponent content='Loading activity...' />

  return (
    <Segment clearing>
      <Header content='Activity details' sub color='teal'/>
      <Formik 
        validationSchema={validationScheme}
        enableReinitialize 
        initialValues={activity} 
        onSubmit={values => handleFormSubmit(values)}>
        {({handleSubmit, isValid, isSubmitting, dirty}) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
            <MyTextInput name='title' placeholder='title'/>
            <MyTextArea rows={3} placeholder="Description"  name='description' />
            <MySelectInput options={categoryOptions} placeholder="Category"  name='category' />
            <MyDateInput 
              placeholderText="Date" 
              name='date' 
              showTimeSelect 
              timeCaption='time'
              dateFormat={'MMMM d, yyyy h:mm: aa'}	
            />
            <Header content='Location Detials' sub color='teal' />
            <MyTextInput placeholder="City" name='city' />
            <MyTextInput placeholder="Venue" name='venue' />
            <Button 
              loading={loading} 
              floated='right' 
              positive 
              type='submit' 
              content="Submit" 
              disabled={!dirty || !isValid || isSubmitting}
            />
            <Button floated='right' type='button' content="Cancel" as={Link} to={'/activities'} />
          </Form>
        )}
      </Formik>
    </Segment>
  )
})
