import React, { useContext } from 'react';
import './Tri.css';
import { TodoContext } from '../../context/TodoContext';

function Tri() {
    const { critereTri, setCritereTri } = useContext(TodoContext);

    const triOptions = [
        { value: 'date_echeance', label: 'Échéance' },
        { value: 'date_creation', label: 'Création' },
        { value: 'titre', label: 'Nom' }
    ];

    return (
        <div className="tri-container d-flex align-items-center gap-2">
            <label htmlFor="tri-select" className="form-label mb-0">Trier par:</label>
            <select
                id="tri-select"
                className="form-select form-select-sm"
                value={critereTri}
                onChange={(e) => setCritereTri(e.target.value)}
                style={{ maxWidth: '200px' }}
            >
                {triOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Tri;
