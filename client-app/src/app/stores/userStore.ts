import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/route";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }


    login = async (creds: UserFormValues) => {
        // get user from DB 
        const user = await agent.Account.login(creds);
        // set token in local storage so they dont have to re login everytime
        store.commonStore.setToken(user.token)
        // set the class property to the retrieved user 
        runInAction(() => this.user = user);
        // send to activities
        router.navigate("/activities");
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/')
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        }
        catch (error) {
            console.log(error)
        }
    }

    register = async (creds: UserFormValues) => {
        // get user from DB 
        const user = await agent.Account.register(creds);
        store.commonStore.setToken(user.token)
        runInAction(() => this.user = user);
        router.navigate("/activities");
        store.modalStore.closeModal();
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    }
}