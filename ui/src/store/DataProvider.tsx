import React, { createContext, useCallback, useReducer } from 'react';
import { getClients } from '../services/api';

const initialState: IApplicationState = {
	clients: [],
};

export const StateContext = createContext<{
	state: IApplicationState;
	dispatch: React.Dispatch<Action>;
  fetchClients: ()=>void
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
			return { ...state, clients: action.data };
		default:
			return state;
	}
};

export default function DataProvider({ children }: { children?: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const fetchClients = useCallback(() => {
		getClients({
			page: 1,
			pageSize: 5,
		}).then((res) => {
			console.log('res?.data?.clients', res.data);
			dispatch({ type: 'FETCH_ALL_CLIENTS', data: res?.data?.clients });
		});
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
