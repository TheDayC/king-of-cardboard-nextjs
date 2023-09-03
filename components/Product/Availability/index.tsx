import React from 'react';

import { StockStatus } from '../../../enums/products';
import { getStockStatusColor } from '../../../utils/account/products';

interface AvailabilityProps {
    isAvailable: boolean;
    stockStatus: StockStatus;
}

export const Availability: React.FC<AvailabilityProps> = ({ isAvailable, stockStatus }) => {
    const isImport = stockStatus === StockStatus.Import;
    const isPreOrder = stockStatus === StockStatus.PreOrder;

    const stockStatusColor = getStockStatusColor(stockStatus);

    if (isPreOrder) {
        return <span style={{ color: stockStatusColor }}>Pre-Order</span>;
    }

    if (isImport) {
        return <span style={{ color: stockStatusColor }}>Import</span>;
    }

    if (isAvailable) {
        return <span className="text-green-600">In Stock</span>;
    }

    return <span className="text-red-600">Out of Stock</span>;
};

export default Availability;
