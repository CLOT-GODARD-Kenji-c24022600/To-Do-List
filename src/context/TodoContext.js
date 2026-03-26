import React, { createContext, useState } from 'react';
import data from '../data/data.json';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    
    const [taches, setTaches] = useState(data.taches);
    const [dossiers, setDossiers] = useState(data.dossiers);
    const [relations, setRelations] = useState(data.relations);

    const [filtreEnCours, setFiltreEnCours] = useState(true);
    const [critereTri, setCritereTri] = useState('date_echeance_desc');

    const value = {
        taches, setTaches,
        dossiers, setDossiers,
        relations, setRelations,
        filtreEnCours, setFiltreEnCours,
        critereTri, setCritereTri
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};
