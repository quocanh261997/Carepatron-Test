interface IClient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface IApplicationState {
    clients: IClient[];
    totalClients: number;
}

interface IRESTResponse {
    message: string;
    data?: {
        client?: IClient;
        clients?: IClient[];
        meta?: {
            pageNumber: number;
            pageSize: number;
            total: number;
        }
    }
}
