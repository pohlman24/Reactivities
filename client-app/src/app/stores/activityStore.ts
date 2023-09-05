import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent";
import {v4 as uuid } from 'uuid';

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
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivites = async () => 
    {
        this.setLoadingInital(true)
        try 
        {
            const activities = await agent.Activities.list();
            activities.forEach(activity => 
            {
                activity.date = activity.date.split('T')[0];
                this.activityRegistry.set(activity.id, activity)
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

    selectActivty = (id: string) => 
    {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => 
    {
        this.selectedActivity = undefined
    }

    openForm = (id?: string) => 
    {
        id ? this.selectActivty(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => 
    {
        this.editMode = false;
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
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity;
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