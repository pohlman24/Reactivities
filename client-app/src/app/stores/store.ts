import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

// defining store Type and its properties/methods
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore
}

// create local object named store 
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
}

export const StoreContext = createContext(store);

// custom hook that returns StoreContext and storeContext contains our activityStore 
export function useStore() {
    return useContext(StoreContext);
}