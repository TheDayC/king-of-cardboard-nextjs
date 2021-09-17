import React from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';

import { setStep } from '../../../../../store/slices/checkout';
import { Steps } from '../../../../../enums/checkout';
import useStyles from './styles';

interface EditProps {
    editStep: Steps;
}

export const Edit: React.FC<EditProps> = ({ editStep }) => {
    const dispatch = useDispatch();
    const styles = useStyles();

    const handleEdit = () => {
        dispatch(setStep(editStep));
    };

    return (
        <Typography variant="overline" onClick={handleEdit} className={styles.edit}>
            {' '}
            - Edit
        </Typography>
    );
};

export default Edit;
