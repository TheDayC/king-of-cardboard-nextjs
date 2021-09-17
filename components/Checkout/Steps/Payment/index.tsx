import React from 'react';
import { useSelector } from 'react-redux';
import { Step, StepLabel, StepContent, Typography, Button } from '@material-ui/core';

import useStyles from '../styles';
import selector from './selector';
import { Steps } from '../../../../../enums/checkout';
import Edit from '../Edit';

export const Payment: React.FC = (props) => {
    const styles = useStyles();
    // const dispatch = useDispatch();
    const { currentStep } = useSelector(selector);
    const isCurrentStep = Boolean(currentStep === Steps.Payment);

    const handleContinue = () => {
        // TODO: Place order
    };

    return (
        <Step>
            <StepLabel>
                <Typography>Payment{!isCurrentStep && <Edit editStep={Steps.Payment} />}</Typography>
                <Typography variant="caption">Payment method and order confirmation</Typography>
            </StepLabel>
            <StepContent {...props}>
                <div className={styles.actionsContainer}>
                    <Button variant="contained" color="primary" onClick={handleContinue} className={styles.button}>
                        Place Order
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
};

export default Payment;
