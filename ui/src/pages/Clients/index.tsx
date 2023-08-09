import { memo, useContext, useEffect, useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	InputAdornment,
	InputLabel,
	Modal,
	OutlinedInput,
	Pagination,
	Paper,
	Step,
	StepButton,
	Stepper,
	TextField,
	Typography,
} from '@mui/material';
import { StateContext } from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import { getClients } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBack, ArrowLeft } from '@mui/icons-material';
import CreateModal from './CreateModal';
function Clients() {
	const { state, fetchClients } = useContext(StateContext);
	const { clients } = state;

	useEffect(() => {
		fetchClients()
	}, [fetchClients]);

	const [isCreateModalShown, setCreateModalShown] = useState(false);
	return (
		<Page>
			<Typography variant='h4' sx={{ textAlign: 'start' }}>
				Clients
			</Typography>
			<Paper sx={{ margin: 'auto', marginTop: 3 }}>
				<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
					<FormControl sx={{ m: 1, width: '25ch' }} variant='outlined' hiddenLabel>
						<OutlinedInput
							id='outlined-adornment-password'
                            placeholder='Search'
							type={'text'}
							endAdornment={
								<InputAdornment position='end'>
									<SearchIcon />
								</InputAdornment>
							}
						/>
					</FormControl>
					<Button variant='contained' onClick={() => setCreateModalShown(true)}>
						Create new client
					</Button>
				</Box>
				<ClientTable clients={clients} />
                <Pagination count={10} />
			</Paper>
			<CreateModal isCreateModalShown={isCreateModalShown} onClose={()=>setCreateModalShown(false)} />
		</Page>
	);
}

export default memo(Clients);
