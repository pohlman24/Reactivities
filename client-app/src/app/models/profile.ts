import { User } from "./User";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[]; 
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image  = user.image;
    }

    username: string;
    displayName: string;
    image?: string | undefined;
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}

export class ProfileFormValues {
    bio?: string;
    displayName?: string = undefined;
    username: string = ''

    constructor(profile: ProfileFormValues) {
        this.bio = profile.bio;
        this.displayName = profile.displayName;
        this.username = profile.username;
    }
}