import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import './Home.css';
import './Patients.css';
import config from '../config';

function Patients() {
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        phone: '',
        address: '',
        illness: '',
        medicines: '',
        note: '',
        fee: ''
    });

    const [historyData, setHistoryData] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/today/history`);
            const data = await response.json();
            if (response.ok) {
                console.log('Fetched history data:', data); // Log fetched data
                setHistoryData(data);
                // Calculate total fee for today
                const total = data.reduce((sum, patient) => sum + Number(patient.fee), 0);
                setTodayTotal(total);
            } else {
                console.error('Failed to fetch history:', data.message);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting form data:', formData); // Log form data before submission

        try {
            const response = await fetch(`${config.BASE_URL}/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert('Data saved successfully');
                fetchHistory(); // Refresh the history data after successful submission
                // Clear form after successful submission
                setFormData({
                    patientName: '',
                    age: '',
                    phone: '',
                    address: '',
                    illness: '',
                    medicines: '',
                    note: '',
                    fee: ''
                });
            } else {
                alert(`Error: ${data.message || 'Failed to save data. Please try again.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };


    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="col py-3 content-area">
                    <h3 className="caption">Enter Data</h3>
                    <main className="col-md-12 p-3 bg-white">
                        <div className="row">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 col-md-7 col-sm-10">
                                        <form className="p-3 bg-light border rounded" onSubmit={handleSubmit}>
                                            <h5>Patient Information</h5>
                                            <div className="mb-3">
                                                <label htmlFor="patientName" className="form-label">Patient Name</label>
                                                <input type="text" className="form-control" id="patientName" value={formData.patientName} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="age" className="form-label">Age</label>
                                                <input type="number" className="form-control" id="age" value={formData.age} onChange={handleInputChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="phone" className="form-label">Phone No</label>
                                                <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <input type="text" className="form-control" id="address" value={formData.address} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="illness" className="form-label">Illness</label>
                                                <textarea className="form-control" id="illness" rows="2" value={formData.illness} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="medicines" className="form-label">Medicines</label>
                                                <textarea className="form-control" id="medicines" rows="2" value={formData.medicines} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="note" className="form-label">Note</label>
                                                <textarea className="form-control" id="note" rows="2" value={formData.note} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="fee" className="form-label">Fee (Rs.)</label>
                                                <input type="number" className="form-control" id="fee" value={formData.fee} onChange={handleInputChange} required />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </form>
                                    </div>
                                    {/* Second Column - Card with Table */}
                                    <div className="col-lg-4 col-md-5 d-none d-md-block">
                                        <div className="card border-0 p-3 mb-3" style={{ backgroundColor: 'rgba(173, 216, 230, 0.5)' }}>
                                            <h5 className="card-title">Today's Patient Summary</h5>
                                            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <table className="table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th>Patient Name</th>
                                                            <th>Fee</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {historyData.map((patient, index) => (
                                                            <tr key={index}>
                                                                <td>{patient.name}</td> {/* Make sure this matches the backend response */}
                                                                <td>Rs. {patient.fee}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                    <tfoot className="table-info">
                                                        <tr>
                                                            <td><strong>Total</strong></td>
                                                            <td><strong>Rs. {todayTotal}</strong></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Patients;