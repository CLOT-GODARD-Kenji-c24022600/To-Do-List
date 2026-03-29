import React, { createContext, useState } from 'react';
import data from '../data/data.json';
import { ETAT_TERMINE } from '../data/enums';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    
    const [taches, setTaches] = useState(data.taches);
    const [dossiers, setDossiers] = useState(data.dossiers);
    const [relations, setRelations] = useState(data.relations);

    const [filtreEnCours, setFiltreEnCours] = useState(true);
    const [filtreEtats, setFiltreEtats] = useState([]);
    const [filtreDossiers, setFiltreDossiers] = useState([]);
    const [critereTri, setCritereTri] = useState('date_echeance');
    const [modeVue, setModeVue] = useState('taches'); // 'taches' or 'dossiers'
    const [cacherEcheuesAnciens, setCacherEcheuesAnciens] = useState(false); // Optionnel: masquer tâches > 7j

    // Fonctions utilitaires
    const getTachesNonTerminees = () => {
        return taches.filter(tache => !ETAT_TERMINE.includes(tache.etat));
    };

    const isEchuDeplusDeSeptJours = (dateEcheance) => {
        const now = new Date();
        const echeance = new Date(dateEcheance);
        const diff = now - echeance;
        const jours = diff / (1000 * 60 * 60 * 24);
        return jours > 7;
    };

    const getTacheFiltrees = () => {
        let filtered = [...taches];

        // Masquer les tâches échues depuis > 7 jours (optionnel)
        if (cacherEcheuesAnciens) {
            filtered = filtered.filter(tache => !isEchuDeplusDeSeptJours(tache.date_echeance));
        }

        // Filtre par état terminal (par défaut, on cache les taches terminées)
        if (filtreEnCours) {
            filtered = filtered.filter(tache => !ETAT_TERMINE.includes(tache.etat));
        }

        // Filtre par états spécifiques si sélectionnés
        if (filtreEtats.length > 0) {
            filtered = filtered.filter(tache => filtreEtats.includes(tache.etat));
        }

        // Filtre par dossiers si sélectionnés
        if (filtreDossiers.length > 0) {
            filtered = filtered.filter(tache => {
                const tacheFolders = relations
                    .filter(r => r.tache === tache.id)
                    .map(r => r.dossier);
                return filtreDossiers.some(dossier => tacheFolders.includes(dossier));
            });
        }

        return filtered;
    };

    const getTacheTriees = () => {
        let sorted = [...getTacheFiltrees()];

        if (critereTri === 'date_echeance') {
            sorted.sort((a, b) => new Date(b.date_echeance) - new Date(a.date_echeance));
        } else if (critereTri === 'date_creation') {
            sorted.sort((a, b) => new Date(a.date_creation) - new Date(b.date_creation));
        } else if (critereTri === 'titre') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        }

        return sorted;
    };

    const getDossiersForTache = (tacheId) => {
        const dossiersIds = relations
            .filter(r => r.tache === tacheId)
            .map(r => r.dossier);
        return dossiers.filter(d => dossiersIds.includes(d.id));
    };

    const getTachesForDossier = (dossierId) => {
        const tachesIds = relations
            .filter(r => r.dossier === dossierId)
            .map(r => r.tache);
        return taches.filter(t => tachesIds.includes(t.id));
    };

    // CRUD Taches
    const addTache = (tache) => {
        const newTache = {
            ...tache,
            id: Math.max(...taches.map(t => t.id), 0) + 1,
            date_creation: new Date().toISOString().split('T')[0]
        };
        setTaches([...taches, newTache]);
        return newTache;
    };

    const updateTache = (id, updatedTache) => {
        setTaches(taches.map(t => t.id === id ? { ...t, ...updatedTache } : t));
    };

    const deleteTache = (id) => {
        setTaches(taches.filter(t => t.id !== id));
        setRelations(relations.filter(r => r.tache !== id));
    };

    // CRUD Dossiers
    const addDossier = (dossier) => {
        const newDossier = {
            ...dossier,
            id: Math.max(...dossiers.map(d => d.id), 0) + 1
        };
        setDossiers([...dossiers, newDossier]);
        return newDossier;
    };

    const updateDossier = (id, updatedDossier) => {
        setDossiers(dossiers.map(d => d.id === id ? { ...d, ...updatedDossier } : d));
    };

    const deleteDossier = (id) => {
        setDossiers(dossiers.filter(d => d.id !== id));
        setRelations(relations.filter(r => r.dossier !== id));
    };

    // Gestion des relations tache-dossier
    const addRelation = (tacheId, dossierId) => {
        if (!relations.find(r => r.tache === tacheId && r.dossier === dossierId)) {
            setRelations([...relations, { tache: tacheId, dossier: dossierId }]);
        }
    };

    const removeRelation = (tacheId, dossierId) => {
        setRelations(relations.filter(r => !(r.tache === tacheId && r.dossier === dossierId)));
    };

    // Gestion des filtres
    const toggleFiltreEtat = (etat) => {
        if (filtreEtats.includes(etat)) {
            setFiltreEtats(filtreEtats.filter(e => e !== etat));
        } else {
            setFiltreEtats([...filtreEtats, etat]);
        }
    };

    const toggleFiltreDossier = (dossierId) => {
        if (filtreDossiers.includes(dossierId)) {
            setFiltreDossiers(filtreDossiers.filter(d => d !== dossierId));
        } else {
            setFiltreDossiers([...filtreDossiers, dossierId]);
        }
    };

    // Reset
    const resetData = () => {
        setTaches(data.taches);
        setDossiers(data.dossiers);
        setRelations(data.relations);
        setFiltreEnCours(true);
        setFiltreEtats([]);
        setFiltreDossiers([]);
    };

    const value = {
        // États
        taches, setTaches,
        dossiers, setDossiers,
        relations, setRelations,
        filtreEnCours, setFiltreEnCours,
        filtreEtats, setFiltreEtats,
        filtreDossiers, setFiltreDossiers,
        critereTri, setCritereTri,
        modeVue, setModeVue,
        cacherEcheuesAnciens, setCacherEcheuesAnciens,
        
        // Fonctions utilitaires
        getTachesNonTerminees,
        getTacheFiltrees,
        getTacheTriees,
        getDossiersForTache,
        getTachesForDossier,
        
        // CRUD Taches
        addTache,
        updateTache,
        deleteTache,
        
        // CRUD Dossiers
        addDossier,
        updateDossier,
        deleteDossier,
        
        // Relations
        addRelation,
        removeRelation,
        
        // Filtres
        toggleFiltreEtat,
        toggleFiltreDossier,
        
        // Reset
        resetData
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};
