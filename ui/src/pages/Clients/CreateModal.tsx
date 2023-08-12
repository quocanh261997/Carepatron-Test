import {memo, useCallback, useContext, useRef, useState} from 'react';
import {
    Box,
    Button,
    createTheme,
    IconButton,
    Modal,
    Step,
    StepLabel,
    Stepper, TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import {StateContext} from '../../store/DataProvider';
import {createClient, updateClient} from '../../services/api';
import {ArrowBack} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

interface Props {
    isCreateModalShown: boolean;
    client?: IClient;
    onClose: () => void;
}

function CreateModal({isCreateModalShown, onClose, client}: Props) {
    const {fetchClients} = useContext(StateContext);
    const [currentStep, setCurrentStep] = useState(0);

    const {t} = useTranslation();

    const {
        handleSubmit,
        control,
        reset,
        getValues,
        trigger,
    } = useForm<IClient>({
        defaultValues: {
            id: client?.id || '',
            firstName: client?.firstName || '',
            lastName: client?.lastName || '',
            email: client?.email || '',
            phoneNumber: client?.phoneNumber || '',
        },
        mode: 'onChange', // This would impact performance, but given the size of this application, it's not a problem
    });

    const submitForm = useCallback(() => {
        const formData = getValues();
        if (client !== null && client !== undefined) {
            updateClient(formData)
                .then(() => fetchClients(1))
                .then(onClose)
                .then(() => setCurrentStep(0))
                .catch((error) => {
                    alert(error);
                });
        } else {
            createClient(formData)
                .then(() => fetchClients(1))
                .then(onClose)
                .then(() => setCurrentStep(0))
                .then(() => reset())
                .catch((error) => {
                    alert(error);
                });
        }
    }, [onClose, fetchClients, client, getValues]);

    const onCloseModal = () => {
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
                    <Controller
                        name='firstName'
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^[a-zA-Z]+$/,
                        }}
                        render={({field: {onChange, value, ref}, fieldState: {error}}) => (
                            <>
                                <Typography variant='body2'>{t('clients.createModal.firstName')}</Typography>
                                <TextField
                                    error={!!error}
                                    value={value}
                                    fullWidth
                                    helperText={error ? t('clients.createModal.firstNameError') : ''}
                                    InputLabelProps={{shrink: true}}
                                    onChange={onChange}
                                ></TextField>
                            </>
                        )}
                    ></Controller>

                    <Controller
                        name='lastName'
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^[a-zA-Z]+$/,
                        }}
                        render={({field: {onChange, value, ref}, fieldState: {error}}) => (
                            <>
                                <Typography variant='body2'>{t('clients.createModal.lastName')}</Typography>
                                <TextField
                                    error={!!error}
                                    value={value}
                                    fullWidth
                                    helperText={error ? t('clients.createModal.lastNameError') : ''}
                                    InputLabelProps={{shrink: true}}
                                    onChange={onChange}
                                ></TextField>
                            </>
                        )}
                    ></Controller>
                </Box>
            ),
        },
        {
            id: 'contact',
            label: t('clients.createModal.contact'),
            form: (
                <Box>
                    <Controller
                        name='email'
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        }}
                        render={({field: {onChange, value, ref}, fieldState: {error}}) => (
                            <>
                                <Typography variant='body2'>{t('clients.createModal.email')}</Typography>
                                <TextField
                                    error={!!error}
                                    value={value}
                                    fullWidth
                                    helperText={error ? t('clients.createModal.emailError') : ''}
                                    InputLabelProps={{shrink: true}}
                                    onChange={onChange}
                                ></TextField>
                            </>
                        )}
                    ></Controller>
                    <Controller
                        name='phoneNumber'
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^\+?[0-9]{10}$/,
                        }}
                        render={({field: {onChange, value, ref}, fieldState: {error}}) => (
                            <>
                                <Typography variant='body2'>{t('clients.createModal.phoneNumber')}</Typography>
                                <TextField
                                    error={!!error}
                                    value={value}
                                    fullWidth
                                    helperText={error ? t('clients.createModal.phoneNumberError') : ''}
                                    InputLabelProps={{shrink: true}}
                                    onChange={onChange}
                                ></TextField>
                            </>
                        )}
                    ></Controller>
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
            <form>
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
                    <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2}}>
                        <Typography variant='h6' sx={{pt: 0.5}}>
                            {client ? t('clients.updateModal.title') : t('clients.createModal.title')}
                        </Typography>
                        <IconButton onClick={onCloseModal}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                    <Stepper nonLinear activeStep={currentStep} sx={{mb: 3}}>
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
                            <Box key={i} display={i === currentStep ? 'block' : 'none'}>{e.form}</Box>
                        ))}
                    </ThemeProvider>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mt: 2}}>
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
                                startIcon={<ArrowBack/>}
                            >
                                {t('clients.createModal.back')}
                            </Button>
                        )}
                        {currentStep !== steps.length - 1 ? (
                            <Button
                                variant='contained'
                                color='seaBlue'
                                onClick={async () => {
                                    const isValid = await trigger(['firstName', 'lastName']);
                                    if (isValid) {
                                        setCurrentStep((step) => step + 1);
                                    }
                                }}
                            >
                                {t('clients.createModal.continue')}
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                color='seaBlue'
                                onClick={async () => {
                                    const isValid = await trigger(['email', 'phoneNumber']);
                                    if (isValid) {
                                        submitForm();
                                    }
                                }}
                            >
                                {client ? t('clients.updateModal.update') : t('clients.createModal.create')}
                            </Button>
                        )}
                    </Box>
                </Box>
            </form>
        </Modal>
    );
}

export default memo(CreateModal);
