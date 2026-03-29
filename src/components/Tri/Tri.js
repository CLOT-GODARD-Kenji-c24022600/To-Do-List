import React, { useContext } from 'react';
import './Tri.css';
import { TodoContext } from '../../context/TodoContext';

function Tri() {
    const { critereTri, setCritereTri } = useContext(TodoContext);

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body py-2 px-3 d-flex align-items-center justify-content-end gap-2">
                <strong className="text-muted text-nowrap" style={{ fontSize: '14px' }}>Trier par :</strong>
                <select 
                    className="form-select form-select-sm border-0 bg-light" 
                    style={{ width: 'auto', fontWeight: 'bold' }}
                    value={critereTri}
                    onChange={(e) => setCritereTri(e.target.value)}
                >
                    <option value="date_echeance">Date d'échéance</option>
                    <option value="date_creation">Date de création</option>
                    <option value="titre">Nom (A-Z)</option>
                </select>
            </div>
        </div>
    );
}

export default Tri;