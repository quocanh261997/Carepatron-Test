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
    const {
        page = "0",
        pageSize = "5",
        search = "",
    } = req.query;
    const clients = listClients({
        pageNumber: parseInt(page as string, 10),
        pageSize: parseInt(pageSize as string, 10),
    }, search as string);

    if (clients.length === 0) {
        res.status(404).send({
            message: 'No clients found',
            data: {
                clients: clients
            }
        });
    }

    res.status(200).send({
        message: 'Successfully found clients',
        data: {
            clients: clients
        }
    })
});

// create client
app.post('/clients', (req: Request, res: Response) => {
    const client: IClient = {...req.body, id: new Date().toISOString()};
    addClient({...client, id: uuid()});

    res.status(201).send({
        message: 'Successfully created client',
        data: {
            client: client,
        }
    });
});

// update client
app.put('/clients/:id', (req: Request, res: Response) => {
    try {
        const client: IClient = req.body;
        updateClient(client);
        res.status(204).send({
            message: 'Successfully updated client',
            data: {
                client: client,
            }
        });
    } catch (error: any) {
        res.status(404).send({
            message: error.message,
        });
    }
});

// delete client
app.delete('/clients/:id', (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        removeClient(id);
        res.status(204).send({
            message: 'Successfully deleted client'
        });
    } catch (error: any) {
        res.status(404).send({
            message: error.message,
        });
    }
});
