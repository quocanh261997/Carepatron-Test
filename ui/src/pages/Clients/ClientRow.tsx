import {IconButton, TableCell, TableRow} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteClient} from '../../services/api';
import {useContext} from 'react';
import {StateContext} from '../../store/DataProvider';

export interface IProps {
    client: IClient;
}

export default function ClientListItem({client}: IProps) {
    const {fetchClients} = useContext(StateContext);
    const {id, firstName, lastName, email, phoneNumber} = client;

    return (
        <TableRow
            key={id}
            sx={{
                '&:last-child td, &:last-child th': {border: 0},
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                },
            }}
        >
            <TableCell component='th' scope='row' sx={{color: 'seaBlue.main', fontWeight: 'bold'}}>
                {firstName} {lastName}
            </TableCell>
            <TableCell>{phoneNumber}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>
                <IconButton
                    aria-label='delete'
                    onClick={() => {
                        deleteClient(client).then(() => fetchClients(1));
                    }}
                >
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
