import {memo, useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Pagination,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {StateContext} from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CreateModal from './CreateModal';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from "react-hook-form";

function Clients() {
    const {state, fetchClients} = useContext(StateContext);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const {clients, totalClients} = state;
    const pageSize = 5;

    const {
        handleSubmit,
        control,
        reset,
        formState: {isDirty},
        getValues,
    } = useForm({
        defaultValues: {
            search: "",
        }
    })

    useEffect(() => {
        fetchClients(page, searchQuery);
    }, [page, fetchClients, searchQuery]);

    useEffect(() => {
        setTotalPage(Math.ceil(totalClients / pageSize));
    }, [totalClients]);

    const [isCreateModalShown, setCreateModalShown] = useState(false);


    const {t} = useTranslation();

    return (
        <Page>
            <Typography variant='h4' sx={{textAlign: 'start'}}>
                {t('clients.pageTitle')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    mt: 2,
                }}
            >
                <form onSubmit={handleSubmit(() => setSearchQuery(getValues('search')))}>
                    <Controller
                        name='search'
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <OutlinedInput
                                sx={{
                                    bgcolor: 'white',
                                    height: '40px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: '0.5px',
                                    },
                                    width:"100%"
                                }}
                                id='outlined-adornment-password'
                                placeholder={t('clients.searchPlaceholder')}
                                type={'text'}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            disabled={!isDirty}
                                            onClick={() => {
                                                reset({search: ""});
                                                setSearchQuery("");
                                            }}
                                        >
                                            {isDirty ? <ClearIcon/> : <SearchIcon/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </form>
                <Button
                    sx={{height: '40px'}}
                    variant='contained'
                    color='seaBlue'
                    onClick={() => setCreateModalShown(true)}
                >
                    {t('clients.createBtn')}
                </Button>
            </Box>

            <Paper sx={{margin: 'auto', marginTop: 3}}>
                <ClientTable clients={clients}/>
            </Paper>

            <Stack alignItems='center' sx={{mt: 2}} spacing={2}>
                <Pagination
                    page={page}
                    count={totalPage}
                    variant={'outlined'}
                    color={'seaBlue'}
                    size='small'
                    onChange={(event, value) => setPage(value)}
                />
            </Stack>
            <CreateModal isCreateModalShown={isCreateModalShown} onClose={() => setCreateModalShown(false)}/>
        </Page>
    );
}

export default memo(Clients);
