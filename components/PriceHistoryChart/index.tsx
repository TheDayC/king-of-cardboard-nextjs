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
import { toNumber } from 'lodash';
import { MdOutlineTrendingUp, MdTrendingDown, MdTrendingFlat } from 'react-icons/md';
import { DateTime } from 'luxon';

import { PriceHistory } from '../../types/products';
import { getPercentageChange } from '../../utils/account/products';

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

    const isGreaterThanOne = priceHistory.length > 1;
    const percentageChange = isGreaterThanOne
        ? getPercentageChange(
              toNumber(priceHistory[priceHistory.length - 2].price),
              toNumber(priceHistory[priceHistory.length - 1].price)
          )
        : 0;

    const data = {
        labels: priceHistory.map(({ timestamp }) => DateTime.fromISO(timestamp).toFormat('dd/MM/yyyy')),
        datasets: [
            {
                label: 'Market Price',
                data: priceHistory.map(({ price }) => (price / 100).toFixed(2)),
                borderColor: 'rgb(195, 101, 246)',
                backgroundColor: 'rgb(195, 101, 246, 0.5)',
            },
        ],
    };

    return (
        <div className="flex flex-col flex-wrap justify-start items-start mb-4 space-x-2">
            <h3 className="text-3xl mt-4">Price History</h3>
            <p className="mt-4 text-xl">
                <span className="font-semibold">Monthly change:</span> {percentageChange}%
                {percentageChange > 0 && <MdOutlineTrendingUp className="inline-block ml-2 w-6 h-6 text-green-600" />}
                {percentageChange < 0 && <MdTrendingDown className="inline-block ml-2 w-6 h-6 text-red-600" />}
                {percentageChange === 0 && <MdTrendingFlat className="inline-block ml-2 w-6 h-6 text-blue-600" />}
            </p>
            <Line options={CONFIG} data={data} />
        </div>
    );
};

export default PriceHistoryChart;
