import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { MergedShipmentMethods } from '../../../../types/checkout';

interface ShipmentProps {
    id: string;
    shippingMethods: MergedShipmentMethods[];
    shipmentCount: number;
    shipmentsTotal: number;
    control: Control<FieldValues, object>; // eslint-disable-line @typescript-eslint/ban-types
    defaultChecked: string;
    expanded: string;
    handleAccordion: (panel: string) => (event: any, isExpanded: boolean) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const Shipment: React.FC<ShipmentProps> = ({
    id,
    shippingMethods,
    shipmentCount,
    shipmentsTotal,
    control,
    defaultChecked,
    expanded,
    handleAccordion,
}) => (
    <Accordion expanded={expanded === id} onChange={handleAccordion(id)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography>
                Shipment {shipmentCount} of {shipmentsTotal}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <FormControl component="fieldset">
                <FormLabel component="legend">Shipping Methods</FormLabel>
                <RadioGroup aria-label="shipping-methods" defaultValue="" name="shippingMethods">
                    {shippingMethods.map((method) => (
                        <FormControlLabel
                            value={method.id}
                            defaultChecked={defaultChecked === method.id ? true : false}
                            control={
                                <Controller
                                    name="firstName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Radio {...field} />}
                                    rules={{
                                        required: { value: true, message: 'Required' },
                                    }}
                                />
                            }
                            label={
                                <span className="label-text">
                                    {method.name}
                                    {method.formatted_price_amount_for_shipment}
                                    {method.leadTimes &&
                                        `Available in ${method.leadTimes.minDays} - ${method.leadTimes.maxDays} days.`}
                                </span>
                            }
                            key={`method-${method.id}`}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </AccordionDetails>
    </Accordion>
);

export default Shipment;
