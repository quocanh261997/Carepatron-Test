import {memo, useContext, useEffect, useState} from 'react';
import {
    Box, Button,
    FormControl,
    InputAdornment,
    OutlinedInput,
    Pagination,
    Paper, Stack,
    Typography,
} from '@mui/material';
import {StateContext} from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import SearchIcon from '@mui/icons-material/Search';
import CreateModal from './CreateModal';


function Clients() {
    const {state, fetchClients} = useContext(StateContext);
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const {clients, totalClients} = state;
    const pageSize = 5

    useEffect(() => {
        fetchClients(page)
    }, [page, fetchClients]);

    useEffect(() => {
        setTotalPage(Math.ceil(totalClients / pageSize))
    }, [totalClients])

    const [isCreateModalShown, setCreateModalShown] = useState(false);

    return (
        <Page>
            <Typography variant='h4' sx={{textAlign: 'start'}}>
                Clients
            </Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mt: 2}}>
                <FormControl sx={{width: '25ch'}} variant='outlined' hiddenLabel>
                    <OutlinedInput
                        sx={{
                            bgcolor: 'white',
                            height: '40px',
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderWidth: "0.5px",
                            },
                        }}
                        id='outlined-adornment-password'
                        placeholder='Search clients...'
                        type={'text'}
                        endAdornment={
                            <InputAdornment position='end'>
                                <SearchIcon/>
                            </InputAdornment>
                        }
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </FormControl>
                <Button
                    sx={{height: '40px'}}
                    variant='contained'
                    color="seaBlue"
                    onClick={() => setCreateModalShown(true)}>
                    Create new client
                </Button>
            </Box>

            <Paper sx={{margin: 'auto', marginTop: 3}}>
                <ClientTable clients={clients}/>
            </Paper>

            <Stack alignItems='center' sx={{mt: 2}} spacing={2}>
                <Pagination
                    defaultPage={1}
                    count={totalPage}
                    variant={'outlined'}
                    color={'seaBlue'}
                    size='small'
                    onChange={(event, value) => setPage(value)}
                />
            </Stack>
            <CreateModal
                isCreateModalShown={isCreateModalShown}
                onClose={() => setCreateModalShown(false)}
            />
        </Page>
    );
}

export default memo(Clients);
