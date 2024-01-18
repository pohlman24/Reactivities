import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";

// defining all store types that we have created
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

// create local object named store that will combine all the stores into 1 and be passed 
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

// use the createContext hook and pass our store 
export const StoreContext = createContext(store);

// custom hook that returns StoreContext and storeContext contains our activityStore 
export function useStore() {
    return useContext(StoreContext);
}