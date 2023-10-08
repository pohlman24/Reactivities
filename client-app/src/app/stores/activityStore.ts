import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent";
import {v4 as uuid } from 'uuid';
import { format } from "date-fns";

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
    get groupedActivites()
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
                this.setActivty(activity);
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

    private setActivty = (activity: Activity) => 
    {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity)
    }

    loadActivites = async () => 
    {
        this.setLoadingInital(true);
        try 
        {
            const activities = await agent.Activities.list();
            activities.forEach(activity => 
            {
                this.setActivty(activity)
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

    createActivity = async (activity: Activity) => 
    {
        this.loading = true;
        activity.id = uuid()
        try 
        {
            await agent.Activities.create(activity)
            runInAction(() => 
            {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
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

    updateActivity = async (activity: Activity) => 
    {
        this.loading = true;
        try 
        {
            await agent.Activities.update(activity);
            runInAction(() => 
            {
                // update the store activites by filtering out the old id and adding the new activity
                // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
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
}