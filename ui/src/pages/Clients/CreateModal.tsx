import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	createTheme,
	IconButton,
	Modal,
	Step,
	StepButton,
	StepLabel,
	Stepper,
	TextField,
	ThemeProvider,
	Typography,
} from '@mui/material';
import { StateContext } from '../../store/DataProvider';
import { createClient } from '../../services/api';
import { ArrowBack } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface Props {
	isCreateModalShown: boolean;
	onClose: () => void;
}

function CreateModal({ isCreateModalShown, onClose }: Props) {
	const { fetchClients } = useContext(StateContext);
	const [currentStep, setCurrentStep] = useState(0);
	const { t } = useTranslation();
	const formDataRef = useRef<IClient>({
		id: '',
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
	});
	const submitForm = useCallback(() => {
		createClient(formDataRef.current)
			.then(() => fetchClients(1))
			.then(onClose)
			.then(() => setCurrentStep(0))
			.then(() => resetFormData())
			.catch((error) => {
				alert(error);
			});
	}, [onClose, fetchClients]);

	const resetFormData = () => {
		formDataRef.current = {
			id: '',
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
		};
	};

	const onCloseModal = () => {
		resetFormData();
		setCurrentStep(0);
		onClose();
	};

	const inputTheme = createTheme({
		components: {
			MuiTextField: {
				styleOverrides: {
					root: {
						margin: '5px 0px',
					},
				},
			},
		},
		typography: {
			allVariants: {
				color: '#8c8e93',
			},
		},
	});

	const steps = [
		{
			id: 'personal',
			label: t('clients.createModal.personal'),
			form: (
				<Box>
					<Typography variant='body2'>{t('clients.createModal.firstName')}</Typography>
					<TextField
						key={'firstName'}
						defaultValue={formDataRef.current.firstName}
						fullWidth
						onChange={(event) => {
							formDataRef.current.firstName = event.target.value;
						}}
						InputLabelProps={{ shrink: true }}
					></TextField>
					<Typography variant='body2'>{t('clients.createModal.lastName')}</Typography>
					<TextField
						key={'lastName'}
						defaultValue={formDataRef.current.lastName}
						fullWidth
						onChange={(event) => {
							formDataRef.current.lastName = event.target.value;
						}}
						InputLabelProps={{ shrink: true }}
					></TextField>
				</Box>
			),
		},
		{
			id: 'contact',
			label: t('clients.createModal.contact'),
			form: (
				<Box>
					<Typography variant='body2'>{t('clients.createModal.email')}</Typography>
					<TextField
						key={'email'}
						defaultValue={formDataRef.current.email}
						fullWidth
						onChange={(event) => {
							formDataRef.current.email = event.target.value;
						}}
						InputLabelProps={{ shrink: true }}
					></TextField>
					<Typography variant='body2'>{t('clients.createModal.phoneNumber')}</Typography>
					<TextField
						key={'phoneNumber'}
						defaultValue={formDataRef.current.phoneNumber}
						fullWidth
						onChange={(event) => {
							formDataRef.current.phoneNumber = event.target.value;
						}}
						InputLabelProps={{ shrink: true }}
					></TextField>
				</Box>
			),
		},
	];
	return (
		<Modal
			open={isCreateModalShown}
			onClose={onCloseModal}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			hideBackdrop={true}
		>
			<Box
				sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					borderRadius: 1,
					boxShadow: 16,
					p: 4,
				}}
			>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2 }}>
					<Typography variant='h6' sx={{ pt: 0.5 }}>
						{t('clients.createModal.title')}
					</Typography>
					<IconButton onClick={onCloseModal}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Stepper nonLinear activeStep={currentStep} sx={{ mb: 3 }}>
					{steps.map((step, stepIndex) => {
						return (
							<Step key={step.id} completed={currentStep > stepIndex} color='black'>
								<StepLabel color='inherit'>{step.label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<ThemeProvider theme={inputTheme}>{steps?.[currentStep]?.form}</ThemeProvider>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mt: 2 }}>
					{currentStep !== 0 && (
						<Button
							variant='text'
							sx={{
								color: 'seaBlue.main',
								'&:hover': {
									backgroundColor: 'transparent',
								},
							}}
							onClick={() => setCurrentStep((step) => step - 1)}
							startIcon={<ArrowBack />}
						>
							{t('clients.createModal.back')}
						</Button>
					)}
					{currentStep !== steps.length - 1 ? (
						<Button variant='contained' color='seaBlue' onClick={() => setCurrentStep((step) => step + 1)}>
							{t('clients.createModal.continue')}
						</Button>
					) : (
						<Button variant='contained' color='seaBlue' onClick={() => submitForm()}>
							{t('clients.createModal.create')}
						</Button>
					)}
				</Box>
			</Box>
		</Modal>
	);
}

export default memo(CreateModal);
