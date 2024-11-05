import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import config from '../../config';

// Register required components with Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Second() {
    const [incomeData, setIncomeData] = useState([]);

    useEffect(() => {
        const year = new Date().getFullYear(); // Get the current year
        fetch(`${config.BASE_URL}/income/${year}`)
            .then(response => response.json())
            .then(data => {
                setIncomeData(data); // Update state with the fetched data
            })
            .catch(error => console.error('Error fetching income data:', error));
    }, []);

    // Define data for the line chart
    const data = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Monthly Income',
                data: incomeData, // Use fetched income data
                borderColor: '#3b7ddd',
                backgroundColor: 'rgba(59, 125, 221, 0.2)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3b7ddd',
                pointRadius: 5,
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Income from January to December'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Income ($)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    };

    return (
        <div className="container card" style={{ position: 'relative', height: '50vh', width: '100%' }}>
            <Line data={data} options={options} />
        </div>
    );
}

export default Second;
