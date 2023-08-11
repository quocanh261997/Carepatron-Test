import {memo, useCallback, useContext, useEffect, useRef, useState} from 'react';
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
import {StateContext} from '../../store/DataProvider';
import {createClient, updateClient} from '../../services/api';
import {ArrowBack} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {useTranslation} from 'react-i18next';

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

function CreateModal({isCreateModalShown, onClose, client}: Props) {
    const {fetchClients} = useContext(StateContext);
    const [currentStep, setCurrentStep] = useState(0);

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const {t} = useTranslation();
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
                })
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

    const validateField = (fieldName: string) => {
        let regex;
        switch (fieldName) {
            case 'firstName':
                regex = /^[a-zA-Z]+$/;
                if (!regex.test(formDataRef.current.firstName)) {
                    setFirstNameError(t('clients.createModal.firstNameError'));
                } else {
                    setFirstNameError('');
                }
                break
            case 'lastName':
                regex = /^[a-zA-Z]+$/;
                if (!regex.test(formDataRef.current.lastName)) {
                    setLastNameError(t('clients.createModal.lastNameError'));
                } else {
                    setLastNameError('');
                }
                break
            case 'email':
                regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regex.test(formDataRef.current.email)) {
                    setEmailError(t('clients.createModal.emailError'));
                } else {
                    setEmailError('');
                }
                break
            case 'phoneNumber':
                regex = /^\+?[0-9]{10}$/;
                if (!regex.test(formDataRef.current.phoneNumber)) {
                    setPhoneNumberError(t('clients.createModal.phoneNumberError'));
                } else {
                    setPhoneNumberError('');
                }
                break
            default:
                break
        }
    }


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

    const steps = [
        {
            id: 'personal',
            label: t('clients.createModal.personal'),
            form: (
                <Box>
                    <Typography variant='body2'>{t('clients.createModal.firstName')}</Typography>
                    <TextField
                        error={firstNameError.length > 0}
                        key={'firstName'}
                        value={formDataRef.current.firstName}
                        fullWidth
                        helperText={firstNameError}
                        onChange={(event) => {
                            formDataRef.current.firstName = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
                    ></TextField>
                    <Typography variant='body2'>{t('clients.createModal.lastName')}</Typography>
                    <TextField
                        error={lastNameError.length > 0}
                        key={'lastName'}
                        value={formDataRef.current.lastName}
                        fullWidth
                        helperText={lastNameError}
                        onChange={(event) => {
                            formDataRef.current.lastName = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
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
                        error={emailError.length > 0}
                        key={'email'}
                        value={formDataRef.current.email}
                        fullWidth
                        helperText={emailError}
                        onChange={(event) => {
                            formDataRef.current.email = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
                    ></TextField>
                    <Typography variant='body2'>{t('clients.createModal.phoneNumber')}</Typography>
                    <TextField
                        error={phoneNumberError.length > 0}
                        key={'phoneNumber'}
                        value={formDataRef.current.phoneNumber}
                        fullWidth
                        helperText={phoneNumberError}
                        onChange={(event) => {
                            formDataRef.current.phoneNumber = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
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
                <ThemeProvider theme={inputTheme}>{steps?.[currentStep]?.form}</ThemeProvider>
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
                        <Button variant='contained' color='seaBlue'
                                onClick={() => {
                                    validateField('firstName');
                                    validateField('lastName');
                                    if (firstNameError.length === 0 &&
                                        lastNameError.length === 0) {
                                        setCurrentStep((step) => step + 1)
                                    }
                                }
                                }
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
