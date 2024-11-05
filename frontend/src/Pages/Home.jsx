import React from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import './Home.css';
import First from '../Components/Dashboard/First';
import Second from '../Components/Dashboard/Second';

function Home() {
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Sidebar />
                <div className="content-area">
                    <main className="bg-white">
                        <div className="row">
                            <div className='container'>
                                <div className='row'>
                                    <First/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className='container'>
                                <div className='row'>
                                    <Second/>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Home;