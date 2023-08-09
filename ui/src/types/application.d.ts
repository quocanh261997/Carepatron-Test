interface IClient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface IApplicationState {
    clients: IClient[];
}

interface IRESTResponse {
    message: string;
    data?: {
        client?: IClient;
        clients?: IClient[];
    }
}
