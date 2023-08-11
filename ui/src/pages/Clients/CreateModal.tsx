import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	createTheme,
	IconButton,
	Modal,
	Step,
	StepLabel,
	Stepper,
	TextField,
	ThemeProvider,
	Typography,
} from '@mui/material';
import { StateContext } from '../../store/DataProvider';
import { createClient, updateClient } from '../../services/api';
import { ArrowBack } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { TextFieldWValidation } from '../../components/TextFieldWValidation';

interface Props {
	isCreateModalShown: boolean;
	client?: IClient;
	onClose: () => void;
}

interface FormError {
	firstNameError: string;
	lastNameError: string;
	emailError: string;
	phoneNumberError: string;
}

function CreateModal({ isCreateModalShown, onClose, client }: Props) {
	const { fetchClients } = useContext(StateContext);
	const [currentStep, setCurrentStep] = useState(0);

	const { t } = useTranslation();
	const formDataRef = useRef<IClient>({
		id: client?.id || '',
		firstName: client?.firstName || '',
		lastName: client?.lastName || '',
		email: client?.email || '',
		phoneNumber: client?.phoneNumber || '',
	});
	const submitForm = useCallback(() => {
		if (client !== null && client !== undefined) {
			updateClient(formDataRef.current)
				.then(() => fetchClients(1))
				.then(onClose)
				.then(() => setCurrentStep(0))
				.catch((error) => {
					alert(error);
				});
		} else {
			createClient(formDataRef.current)
				.then(() => fetchClients(1))
				.then(onClose)
				.then(() => setCurrentStep(0))
				.then(() => resetFormData())
				.catch((error) => {
					alert(error);
				});
		}
	}, [onClose, fetchClients, formDataRef, client]);

	const validateField = (fieldName: string, value: string) => {
		let regex;
		switch (fieldName) {
			case 'firstName':
				regex = /^[a-zA-Z]+$/;
				if (!regex.test(value)) {
					throw Error(t('clients.createModal.firstNameError'));
				}
				break;
			case 'lastName':
				regex = /^[a-zA-Z]+$/;
				if (!regex.test(value)) {
					throw Error(t('clients.createModal.lastNameError'));
				} 
				break;
			case 'email':
				regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!regex.test(value)) {
					throw Error(t('clients.createModal.emailError'));
				}
				break;
			case 'phoneNumber':
				regex = /^\+?[0-9]{10}$/;
				if (!regex.test(value)) {
					throw Error(t('clients.createModal.phoneNumberError'));
				}
				break;
			default:
				break;
		}
	};

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
		if (client === undefined || client === null) {
			resetFormData();
		}
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

    const formIsValidRef = useRef<Record<string, boolean>>({})
	const steps = [
		{
			id: 'personal',
			label: t('clients.createModal.personal'),
			form: (
				<Box>
					<TextFieldWValidation
						label={t('clients.createModal.firstName')}
						key={'firstName'}
						onChange={(value, isValid) => {
							formDataRef.current.firstName = value;
                            formIsValidRef.current.firstName = isValid
						}}
						validate={(value) => {
							validateField('firstName', value)
						}}
					></TextFieldWValidation>

					<TextFieldWValidation
						label={t('clients.createModal.lastName')}
						key={'lastName'}
						onChange={(value, isValid) => {
							formDataRef.current.lastName = value;
                            formIsValidRef.current.lastName = isValid;
						}}
						validate={(value) => {
							validateField('lastName', value)
						}}
					></TextFieldWValidation>
				</Box>
			),
		},
		{
			id: 'contact',
			label: t('clients.createModal.contact'),
			form: (
				<Box>
					<TextFieldWValidation
						label={t('clients.createModal.email')}
						key={'email'}
						onChange={(value, isValid) => {
							formDataRef.current.email = value;
                            formIsValidRef.current.email = isValid;
						}}
						validate={(value) => {
							validateField('email', value)
						}}
					></TextFieldWValidation>
					<TextFieldWValidation
						label={t('clients.createModal.phoneNumber')}
						key={'phoneNumber'}
						onChange={(value, isValid) => {
							formDataRef.current.phoneNumber = value;
                            formIsValidRef.current.phoneNumber = isValid;
						}}
						validate={(value) => {
							validateField('phoneNumber', value)
						}}
					></TextFieldWValidation>
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
						{client ? t('clients.updateModal.title') : t('clients.createModal.title')}
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
				<ThemeProvider theme={inputTheme}>
					{steps.map((e, i) => (
						<Box display={i === currentStep ? 'block' : 'none'}>{e.form}</Box>
					))}
				</ThemeProvider>
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
						<Button
							variant='contained'
							color='seaBlue'
							onClick={() => {
                                console.log(formIsValidRef.current)
								if (formIsValidRef.current.firstName && formIsValidRef.current.lastName) {
									setCurrentStep((step) => step + 1);
								}
							}}
						>
							{t('clients.createModal.continue')}
						</Button>
					) : (
						<Button variant='contained' color='seaBlue' onClick={() => submitForm()}>
							{client ? t('clients.updateModal.update') : t('clients.createModal.create')}
						</Button>
					)}
				</Box>
			</Box>
		</Modal>
	);
}

export default memo(CreateModal);
