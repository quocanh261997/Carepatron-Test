import React, {createContext, useCallback, useReducer} from 'react';
import {getClients} from '../services/api';

const initialState: IApplicationState = {
    clients: [],
    totalClients: 0,
};

export const StateContext = createContext<{
    state: IApplicationState;
    dispatch: React.Dispatch<Action>;
    fetchClients: (page: number, search?: string) => void
}>(
    // @ts-ignore
    null
);

export const ACTIONS = {
    FETCH_ALL_CLIENTS: 'FETCH_ALL_CLIENTS',
};

type Action = {
    type: keyof typeof ACTIONS;
    data: any;
};

const reducer = (state: IApplicationState, action: Action) => {
    switch (action.type) {
        case ACTIONS.FETCH_ALL_CLIENTS:
            return {...state, clients: action.data.clients, totalClients: action.data.meta.total}
        default:
            return state;
    }
};

export default function DataProvider({children}: { children?: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchClients = useCallback(async (page: number, search?: string) => {
        console.log("Hello")
        const res = await getClients({
            page: page,
            pageSize: 5,
            search: search || ''
        });
        dispatch({type: 'FETCH_ALL_CLIENTS', data: res?.data});
    }, []);
    return (
        <StateContext.Provider
            value={{
                state,
                dispatch,
                fetchClients
            }}
        >
            {children}
        </StateContext.Provider>
    );
}
