import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type GraphProps = {
    data: {
        year: number;
        numberOfJobs: number;
    }[];
}

const Graph: React.FC <GraphProps> = ({ data }) => {
    const sortedData = data.sort((a, b) => a.year - b.year);
    const chartData = {
        labels: sortedData.map(item => item.year),
        datasets: [
            {
                label: 'Number of Jobs',
                data: sortedData.map(item => item.numberOfJobs),
                borderColor: '#2f4b7c',
                backgroundColor: '#ffa600',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Number of Jobs from 2020 to 2024',
            },
        },
    };

    return <Line data={chartData} options={options} className='w-min md:w-full flex flex-shrink' />;
};

export default Graph;
