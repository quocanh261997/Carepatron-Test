import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {v4 as uuid} from 'uuid';

import {store, addClient, updateClient, removeClient, listClients} from './data/store';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// on start
app.use(cors({origin: true, credentials: true}));

// capture json
app.use(express.json());

app.listen(port, () => {
    console.log(`Mock API is running at http://localhost:${port}`);
});

// main page
app.get('/', (req: Request, res: Response) => {
    res.send('Mock API');
});

// get clients
app.get('/clients', (req: Request, res: Response) => {
    const {page, pageSize} = req.query;
    const clients = listClients({
        pageNumber: parseInt(page as string, 10),
        pageSize: parseInt(pageSize as string, 10),
    });
    // Since the store always got 1 record, if the returned clients array is empty, then it means the pagination
    // param is not correct (wrong page number).
    if (clients.length === 0) {
        res.status(404).send({
            message: 'No clients found',
            clients: clients,
        });
    }

    res.status(200).send({
        message: 'Successfully found clients',
        clients: clients,
    })
});

// create client
app.post('/clients', (req: Request, res: Response) => {
    const client: IClient = {...req.body, id: new Date().toISOString()};
    addClient({...client, id: uuid()});

    res.status(201).send({
        message: 'Successfully created client',
        client: client,
    });
});

// update client
app.put('/clients/:id', (req: Request, res: Response) => {
    const client: IClient = req.body;
    try {
        updateClient(client);
        res.status(204).send({
            message: 'Successfully updated client',
            client: client,
        });
    } catch (error: any) {
        res.status(404).send({
            message: error.message,
        });
    }
});
