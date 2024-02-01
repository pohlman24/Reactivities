import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // create connection to hub
    createHubConnection = (activityId: string) => {
        // check if we have an activity before trying to connect
        if(store.activityStore.selectedActivity) {
            // make connection to URL 
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            
            // start the connection
            this.hubConnection.start().catch(error => console.log("error establishing the connection: " , error));

            // when connect to hub, want to recieve all comments
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    // need to convert to a javascript object and need to append the Z at the end for UTC time which is what .net uses
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + "Z")
                    })
                    this.comments = comments;
                })
            }
            )
            
            // when user adds new comment 
            this.hubConnection.on("RecieveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.unshift(comment)
                })
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("error stopping connection: ", error))
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: {body: string, activityId?: string}) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error)
        }
    }
}