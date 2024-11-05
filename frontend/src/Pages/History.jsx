import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import './Home.css';
import Table from '../Components/Table/Table';
import axios from 'axios';
import config from '../config';

const columns = [
    { Header: '#', accessor: 'id' },
    { Header: 'Date & Time', accessor: 'formattedDateTime' },
    { Header: 'Patient Name', accessor: 'name' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Phone No', accessor: 'phone' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Illness', accessor: 'illness' },
    { Header: 'Medicines', accessor: 'medicine' },
    { Header: 'Note', accessor: 'note' },
    { Header: 'Fee', accessor: 'fee' }
];

function History() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${config.BASE_URL}/history`)
            .then(response => {
                const formattedData = response.data.map(item => {
                    const date = new Date(item.dateTime);
                    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    
                    const fee = `Rs. ${item.fee.toLocaleString()}`; // Formats the fee with comma for thousands

                    
                    return {
                        ...item,
                        formattedDateTime,
                        fee
                    };
                });
                setData(formattedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching history data:', error);
                setError('Failed to load data');
                setLoading(false);
            });
    }, []);

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h3 className='caption'>History</h3>
                    <main className="col-md-12 p-3 bg-white">
                        <div className="row">
                            <div className='container'>
                                {loading ? (
                                    <p>Loading data...</p>
                                ) : error ? (
                                    <p className="text-danger">{error}</p>
                                ) : (
                                    <Table
                                        data={data}
                                        columns={columns}
                                        enableSort={{ id: true, name: false }}
                                        enableNewButton={true}
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default History;
