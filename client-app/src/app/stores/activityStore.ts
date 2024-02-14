import { makeAutoObservable, runInAction } from "mobx"
import { Activity, ActivityFormValues } from "../models/activity"
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

// so define variables that were previously useState hooks 
// replace each 'handleXYZ' function in the App.tsx with a new funciton here. will do almost exact same thing. 
// --- remove old function from App
export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInital = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate()
    {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
    }

    // makes an array of object where each object has a key that is a unique date
    get groupedActivities ()
    {
        // Object.entries takes an object and returns an array with all key,value pairs as a sub array [[key1, value1], [key2, value2]]
        return Object.entries(
            // reduce((accumulator, current value) => {})
            this.activitiesByDate.reduce((activities, activity) => 
            {
                const date = format(activity.date!, 'dd MMM yyyy') // key for object
                // set value for date key. if date already exist in activities array, 
                // then add current activity to the key along with all the others, if it doesnt exist yet, then add just the activity
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;

            }, {} as {[key: string]: Activity[]}) // key will be a string and value will be an activity array
        )
    }

    // return object will look something like:
    // [
    //     [date: [activity1, activity2, activity3]]
    // ]

    loadActivity = async (id: string) => 
    {
        this.setLoadingInital(true);
        let activity = this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            this.setLoadingInital(false)
            return activity;
        }
        else
        {
            this.setLoadingInital(true)
            try 
            {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInital(false);
                return activity;
            }
            catch (error)
            {
                console.log(error)
                this.setLoadingInital(false)
            }
        }
    }

    private getActivity = (id: string) => 
    {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            );
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    loadActivities = async () => 
    {
        this.setLoadingInital(true);
        try 
        {
            const activities = await agent.Activities.list();
            activities.forEach(activity => 
            {
                this.setActivity(activity)
            })
            this.setLoadingInital(false)
        } 
        catch (error)
        {
            console.log(error)
            this.setLoadingInital(false)
        }
    }

    setLoadingInital = (state: boolean) => 
    {
        this.loadingInital = state;
    }

    createActivity = async (activity: ActivityFormValues) => 
    {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try 
        {
            await agent.Activities.create(activity)
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => 
            {
                this.selectedActivity = newActivity;
            })
        } 
        catch (error) 
        {   
            console.log(error)
        }
    }

    updateActivity = async (activity: ActivityFormValues) => 
    {
        try 
        {
            await agent.Activities.update(activity);
            runInAction(() => 
            {
                if (activity.id) {
                    // get the current activity from the store and fill in its values and then add the values from the form 
                    const updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity)
                    this.selectedActivity = updatedActivity as Activity
                }
            })
        } 
        catch (error) 
        {
            console.log(error)
        }
    }

    deleteActivity = async (id: string) =>
    {
        this.loading = true
        try
        {
            await agent.Activities.delete(id)
            runInAction(() => 
            {
                this.activityRegistry.delete(id)
                this.loading = false;
            })
        }
        catch (error)
        {
            console.log(error)
            runInAction(() => 
            {
                this.loading = false;
            })
        }
    }

    updateAttendence = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);

            runInAction(() => {
                // remove attendee if alreadyd going
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }
                // else add attendee
                else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    clearSelectedActivtiy = () => {
    this.selectedActivity = undefined;
    }

    // helper function to update the UI, called in the ProfileStore
    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activtiy => {
            activtiy.attendees?.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;

                }  
            })
        })
    }
}