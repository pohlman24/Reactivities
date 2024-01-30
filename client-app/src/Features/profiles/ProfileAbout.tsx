import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import ProfileEditForm from './ProfileEditForm.tsx'
import { useStore } from '../../app/stores/store.ts'
import { useState } from 'react';

export default function ProfileAbout() {
    const {userStore, profileStore} = useStore()
    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon={"man"} content={`About ${userStore.user?.displayName}`} floated='left'/>
                    <Button 
                        content={editMode ? 'Cancel': 'Edit Profile'}
                        onClick={() => setEditMode(!editMode)}
                        floated='right'
                        basic
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    { editMode ? (
                        <ProfileEditForm setEditMode={setEditMode}/>
                    ) : (
                        <>
                            <p style={{whiteSpace: 'pre-wrap'}}>{profileStore.profile?.bio}</p>
                        </>
                        
                    )
                }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}