import { Profile } from "./profile";

export interface IActivity 
{
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees?: Profile[];
}

export class Activity implements IActivity {
    constructor(init: ActivityFormValues) {
        this.id = init.id!
        this.title = init.title
        this.date = init.date
        this.description = init.description
        this.category = init.description
        this.venue = init.venue
        this.city = init.city
    }

    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string = '';
    isCancelled: boolean = false;
    isGoing: boolean = false;
    isHost: boolean = false;
    host?: Profile;
    attendees?: Profile[];
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string ='';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    constructor(activtiy?: ActivityFormValues) {
        if (activtiy) {
            this.id = activtiy.id;
            this.title = activtiy.title;
            this.category = activtiy.category;
            this.description = activtiy.description;
            this.date = activtiy.date;
            this.city = activtiy.city;
            this.venue = activtiy.venue;

        }
    }

}