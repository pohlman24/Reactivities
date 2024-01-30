import { useStore } from '../../app/stores/store'
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';
import { observer } from 'mobx-react-lite';
import { Form, Formik } from 'formik';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';

interface Props {
    setEditMode: (state: boolean) => void
}

export default observer(function ProfileEditForm({setEditMode}: Props) {
    const { profileStore, userStore } = useStore();
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required("User display name is required")
    })
    
    return (
        <Formik
            initialValues={{displayName: profileStore.profile?.displayName, bio: profileStore.profile?.bio, username: ""}}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                if(userStore.user) {
                    values.username = userStore.user.username;
                    profileStore.updateProfile(values)
                }
                setEditMode(false)
            }}    
        >
            {({isValid, dirty, isSubmitting}) => (
                <Form className='ui form'>
                <MyTextInput placeholder={profileStore.profile!.displayName} name="displayName" />
                <MyTextArea placeholder='Add your bio' name='bio' rows={2}/>
                <MyTextInput placeholder='' name='username' hidden={true} />
                <Button positive content="Update profile"
                    type="submit"
                    floated='right' 
                    disabled={!dirty || !isValid}
                    loading={isSubmitting}
                />
            </Form>
            )}
            
        </Formik>
    )
})