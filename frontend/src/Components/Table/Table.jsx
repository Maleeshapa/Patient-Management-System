import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

function Table({ data, columns, enableSort = {}, enableNewButton = false }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(null);
    const navigate = useNavigate();

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter data based on search term
    const filteredData = data.filter((row) =>
        columns.some((col) => row[col.accessor]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sorting function
    const handleSort = (accessor) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === accessor && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key: accessor, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    return (
        <div className="table-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                {enableNewButton && (
                    <button className="btn btn-primary" onClick={() => navigate('/Patients')}>
                        New+
                    </button>
                )}
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} onClick={() => enableSort[col.accessor] && handleSort(col.accessor)} style={{ cursor: enableSort[col.accessor] ? 'pointer' : 'default' }}>
                                    {col.Header}
                                    {enableSort[col.accessor] && (
                                        <>
                                            {sortConfig?.key === col.accessor && sortConfig.direction === 'ascending' ? (
                                                <i className="bi bi-sort-alpha-down ms-1"></i>
                                            ) : (
                                                <i className="bi bi-sort-alpha-up ms-1"></i>
                                            )}
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{row[col.accessor]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    {/* <tbody>
                        {sortedData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{col.accessor === 'action' ? row[col.accessor] : row[col.accessor]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody> */}

                </table>
            </div>
        </div>
    );
}

export default Table;
