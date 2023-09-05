import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

// defining store Type and its properties/methods
interface Store {
    activityStore: ActivityStore;
}

// create local object named store 
export const store: Store = {
    activityStore: new ActivityStore
}

export const StoreContext = createContext(store);

// custom hook that returns StoreContext and storeContext contains our activityStore 
export function useStore() {
    return useContext(StoreContext);
}