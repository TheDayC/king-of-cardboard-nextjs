import { createSelector } from '@reduxjs/toolkit';

import { selectAlertsData } from '../../store/state/selectors';

const selector = createSelector([selectAlertsData], (alertData) => ({
    alerts: alertData.alerts,
}));

export default selector;
