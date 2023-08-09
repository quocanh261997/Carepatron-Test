export const store: IStore = {
    entities: {
        'xx-aa-bb': {
            id: 'xx-aa-bb',
            firstName: 'John',
            lastName: 'Smitherin',
            email: 'john@gmail.com',
            phoneNumber: '+6192099102',
        },
    },
};

export const addClient = (client: IClient) => {
    store.entities[client.id] = client;
    return client;
};

export const updateClient = (client: IClient) => {
    if (!store.entities[client.id]) {
        throw new Error(`No client with the given id=${client.id} found`);
    }
    store.entities[client.id] = client;
    return client;
};

export const removeClient = (id: string) => {
    if (!store.entities[id]) {
        throw new Error(`No client with the given id=${id} found`);
    }
    delete store.entities[id];
};

export const listClients = (pagination: IPagination) => {
    // Update this to use pagination
    const {pageNumber, pageSize} = pagination;
    const list = Object.keys(store.entities).map((id) => store.entities[id]);

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginatedList = list.slice(start, end);

    return paginatedList.sort((a, b) => {
        if (a.firstName < b.firstName) {
            return -1;
        }
        if (a.firstName > b.firstName) {
            return 1;
        }
        return 0;
    });
};
