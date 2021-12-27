import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { DateTime } from 'luxon';

import alertsInitialState from '../state/alerts';

const alertsSlice = createSlice({
    name: 'alerts',
    initialState: alertsInitialState,
    reducers: {
        addAlert(state, action) {
            // Destruct msg and type so we can re-use them.
            const { message, level } = action.payload;

            // Set the curretnt dateTime from Luxon.
            const dateTime = DateTime.now().setZone('Europe/London');

            // Create an id by taking the msg, level and the DateTime and converting it to a base64 string.
            // This should be unique enough for any id, even if msg and level are identical the time will have moved on.
            const id = Buffer.from(`${message}-${level}-${dateTime.toISO()}`).toString('base64');

            // Push the object onto the alerts array.
            state.alerts.push({ id, level, message, timestamp: dateTime });
        },
        removeAlert(state, action) {
            // Remove alert by filtering on object id and re-assigning to state.
            state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.subject,
        }),
    },
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
