import {memo, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    Modal,
    Step,
    StepButton,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import {StateContext} from '../../store/DataProvider';
import {createClient, getClients} from '../../services/api';
import {ArrowBack, ArrowLeft} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    isCreateModalShown: boolean;
    onClose: () => void;
}

function CreateModal({isCreateModalShown, onClose}: Props) {
    const {fetchClients} = useContext(StateContext);
    const [currentStep, setCurrentStep] = useState(0);
    const formDataRef = useRef<IClient>({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });
    const submitForm = useCallback(() => {
        createClient(formDataRef.current)
            .then(fetchClients)
            .then(onClose)
            .catch((error) => {
                alert(error);
            });
    }, [onClose, fetchClients]);
    const steps = [
        {
            id: 'personal',
            label: 'Personal details',
            form: (
                <Box>
                    <TextField
                        key={'firstName'}
                        defaultValue={formDataRef.current.firstName}
                        label='First name'
                        fullWidth
                        onChange={(event) => {
                            formDataRef.current.firstName = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
                    ></TextField>
                    <TextField
                        key={'lastName'}
                        defaultValue={formDataRef.current.lastName}
                        label='Last name'
                        fullWidth
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
            label: 'Contact details',
            form: (
                <Box>
                    <TextField
                        key={'email'}
                        defaultValue={formDataRef.current.email}
                        label='Email'
                        fullWidth
                        onChange={(event) => {
                            formDataRef.current.email = event.target.value;
                        }}
                        InputLabelProps={{shrink: true}}
                    ></TextField>
                    <TextField
                        key={'phoneNumber'}
                        defaultValue={formDataRef.current.phoneNumber}
                        label='Phone number'
                        fullWidth
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
            onClose={onClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <IconButton onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
                <Stepper nonLinear activeStep={currentStep}>
                    {steps.map((step, stepIndex) => {
                        return (
                            <Step key={step.id} completed={currentStep > stepIndex}>
                                <StepButton color='inherit' onClick={() => setCurrentStep((step) => step + 1)}>
                                    {step.label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                {steps?.[currentStep]?.form}
                <Box>
                    {currentStep !== 0 && (
                        <Button
                            variant='text'
                            onClick={() => setCurrentStep((step) => step - 1)}
                            startIcon={<ArrowBack/>}
                        >
                            Back
                        </Button>
                    )}
                    {currentStep !== steps.length - 1 ? (
                        <Button variant='contained' onClick={() => setCurrentStep((step) => step + 1)}>
                            Continue
                        </Button>
                    ) : (
                        <Button variant='contained' onClick={() => submitForm()}>
                            Create client
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}

export default memo(CreateModal);
