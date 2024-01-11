import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/route';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/User';

// add manual delay to showcase the loading icons
const sleep = (delay: number) => 
{
    return new Promise((resolve) => 
    {
        setTimeout(resolve, delay)
    })
}

// setting URL for our API
axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config;
})

// add an interceptor so that we can check for error handling
axios.interceptors.response.use(async response => {
    await sleep(300);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if(data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// create object for available request options
const requests = 
{
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// create object for available CRUD actions on activities
const Activities = 
{
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`activities/${id}`)
}

// create object for available CRUD actions on account
const Account = 
{
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

// return both account and activites as a single object
const agent = 
{
    Activities,
    Account
}

export default agent