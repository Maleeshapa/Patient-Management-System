import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './First.css';
import config from '../../config';

function First() {
    const [todayIncome, setTodayIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayIncome = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/history`);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to the start of today
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1); // Set to the start of tomorrow

                // Filter today's records and calculate total fee
                const totalIncome = response.data.reduce((total, item) => {
                    const recordDate = new Date(item.dateTime);
                    if (recordDate >= today && recordDate < tomorrow) {
                        return total + item.fee;
                    }
                    return total;
                }, 0);

                setTodayIncome(totalIncome);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching income data:', error);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchTodayIncome();
    }, []);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 mb-3'>
                    <div className='py-3 p-3 text-center'>
                        <h3> Today Income </h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <p>Rs. {todayIncome.toLocaleString()}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default First;
