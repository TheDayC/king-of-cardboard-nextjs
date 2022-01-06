import { createAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { DateTime } from 'luxon';

import alertsInitialState from '../state/alerts';
import { AlertLevel } from '../../enums/system';
import { AppState } from '..';

const hydrate = createAction<AppState>(HYDRATE);

const alertsSlice = createSlice({
    name: 'alerts',
    initialState: alertsInitialState,
    reducers: {
        addError(state, action) {
            const message = action.payload;
            const level = AlertLevel.Error;

            // Set the curretnt dateTime from Luxon.
            const dateTime = DateTime.now().setZone('Europe/London');

            // Create an id by taking the msg, level and the DateTime and converting it to a base64 string.
            // This should be unique enough for any id, even if msg and level are identical the time will have moved on.
            const id = Buffer.from(`${message}-${level}-${dateTime.toISO()}`).toString('base64');

            // Push the object onto the alerts array.
            state.alerts.push({ id, level, message, timestamp: dateTime });
        },
        addWarning(state, action) {
            const message = action.payload;
            const level = AlertLevel.Warning;

            // Set the curretnt dateTime from Luxon.
            const dateTime = DateTime.now().setZone('Europe/London');

            // Create an id by taking the msg, level and the DateTime and converting it to a base64 string.
            // This should be unique enough for any id, even if msg and level are identical the time will have moved on.
            const id = Buffer.from(`${message}-${level}-${dateTime.toISO()}`).toString('base64');

            // Push the object onto the alerts array.
            state.alerts.push({ id, level, message, timestamp: dateTime });
        },
        addSuccess(state, action) {
            const message = action.payload;
            const level = AlertLevel.Success;

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
    extraReducers: (builder) => {
        builder.addCase(hydrate, (state, action) => ({
            ...state,
            ...action.payload[alertsSlice.name],
        }));
    },
});

export const { addError, addWarning, addSuccess, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
