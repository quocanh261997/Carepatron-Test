import apiClient from './apiClient';

export const getClients = ({ page, pageSize }: { page: number; pageSize: number }): Promise<IRESTResponse> => {
	return apiClient.get<IRESTResponse>(`clients?page=${page}&pageSize=${pageSize}`);
};

export const createClient = (client: IClient): Promise<void> => {
	return apiClient.post<void>('clients', client);
};

export const updateClient = (client: IClient): Promise<void> => {
	return apiClient.put<void>(`clients/${client.id}`, client);
};

export const deleteClient = (client: IClient): Promise<void> => {
	return apiClient.delete<void>(`clients/${client.id}`);
};
