import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { PriceHistory } from '../../../types/imports';

const CONFIG = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Price History',
        },
    },
    scales: {
        y: {
            ticks: {
                // Include a pound sign in the ticks
                callback: function (value: unknown) {
                    return `£${value}`;
                },
            },
        },
    },
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PriceHistoryChartProps {
    priceHistory: PriceHistory[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ priceHistory }) => {
    if (priceHistory.length === 0) return null;

    const data = {
        labels: priceHistory.map(({ timestamp }) => timestamp),
        datasets: [
            {
                label: 'Market Price',
                data: priceHistory.map(({ amount }) => amount),
                borderColor: 'rgb(195, 101, 246)',
                backgroundColor: 'rgb(195, 101, 246, 0.5)',
            },
        ],
    };

    return (
        <div className="flex flex-col flex-wrap justify-start items-start mb-4 space-x-2">
            <h3 className="text-3xl mt-4">Price History</h3>
            <Line options={CONFIG} data={data} />
        </div>
    );
};

export default PriceHistoryChart;
