import React, { createContext, useEffect, useMemo, useState } from 'react';
import data from '../data/data.json';
import { DOSSIER_COLORS, DOSSIER_ICONS, ETATS, ETAT_TERMINE } from '../data/enums';

export const TodoContext = createContext();

const toDateOnly = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toISOString().split('T')[0];
};

const normalizeEquipiers = (equipiers) => {
    if (!Array.isArray(equipiers)) {
        return [];
    }

    return equipiers
        .map((equipier) => {
            if (typeof equipier === 'string') {
                return equipier.trim();
            }

            if (equipier && typeof equipier.name === 'string') {
                return equipier.name.trim();
            }

            return '';
        })
        .filter(Boolean);
};

const normalizeEtat = (etat) => {
    const allowedEtats = Object.values(ETATS);
    return allowedEtats.includes(etat) ? etat : ETATS.NOUVEAU;
};

const normalizeTache = (tache) => {
    return {
        id: Number(tache.id),
        title: (tache.title || '').trim(),
        description: (tache.description || '').trim(),
        date_creation: toDateOnly(tache.date_creation) || toDateOnly(new Date()),
        date_echeance: toDateOnly(tache.date_echeance),
        etat: normalizeEtat(tache.etat),
        equipiers: normalizeEquipiers(tache.equipiers)
    };
};

const normalizeColor = (color) => {
    if (DOSSIER_COLORS.includes(color)) {
        return color;
    }

    return DOSSIER_COLORS[0];
};

const normalizeIcon = (icon) => {
    if (!icon) {
        return '';
    }

    return DOSSIER_ICONS.includes(icon) ? icon : '';
};

const normalizeDossier = (dossier) => {
    return {
        id: Number(dossier.id),
        title: (dossier.title || '').trim(),
        description: (dossier.description || '').trim(),
        color: normalizeColor(dossier.color),
        icon: normalizeIcon(dossier.icon),
        type: dossier.type || ''
    };
};

const createInitialState = () => {
    const taches = data.taches.map(normalizeTache);
    const dossiers = data.dossiers.map(normalizeDossier);

    const validTacheIds = new Set(taches.map((tache) => tache.id));
    const validDossierIds = new Set(dossiers.map((dossier) => dossier.id));
    const relations = data.relations.filter((relation) => {
        return validTacheIds.has(relation.tache) && validDossierIds.has(relation.dossier);
    });

    return {
        taches,
        dossiers,
        relations
    };
};

const validateTache = (tache) => {
    if (!tache.title || tache.title.trim().length < 5) {
        return "Le titre d'une tâche doit contenir au moins 5 caractères.";
    }

    if (!toDateOnly(tache.date_echeance)) {
        return "La date d'échéance est obligatoire et doit être valide.";
    }

    return null;
};

const validateDossier = (dossier) => {
    if (!dossier.title || dossier.title.trim().length < 3) {
        return "Le titre d'un dossier doit contenir au moins 3 caractères.";
    }

    if (!DOSSIER_COLORS.includes(dossier.color)) {
        return 'La couleur du dossier est invalide.';
    }

    if (dossier.icon && !DOSSIER_ICONS.includes(dossier.icon)) {
        return 'Le pictogramme du dossier est invalide.';
    }

    return null;
};

export const TodoProvider = ({ children }) => {
    const initialState = useMemo(() => createInitialState(), []);

    const [taches, setTaches] = useState(initialState.taches);
    const [dossiers, setDossiers] = useState(initialState.dossiers);
    const [relations, setRelations] = useState(initialState.relations);

    const [filtreEnCours, setFiltreEnCours] = useState(true);
    const [filtreEtats, setFiltreEtats] = useState([]);
    const [filtreDossiers, setFiltreDossiers] = useState([]);
    const [critereTri, setCritereTri] = useState('date_echeance');
    const [modeVue, setModeVue] = useState('taches'); // 'taches' or 'dossiers'
    const [cacherEcheuesAnciens, setCacherEcheuesAnciens] = useState(false); // Optionnel: masquer tâches > 7j
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('todo-dark-mode');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('todo-dark-mode', String(darkMode));
    }, [darkMode]);

    const getTachesNonTerminees = () => {
        return taches.filter((tache) => !ETAT_TERMINE.includes(tache.etat));
    };

    const isEchuDePlusDeSeptJours = (dateEcheance) => {
        const now = new Date();
        const echeance = new Date(dateEcheance);
        const diff = now - echeance;
        const jours = diff / (1000 * 60 * 60 * 24);
        return jours > 7;
    };

    const getTachesFiltrees = () => {
        let filtered = [...taches];

        if (cacherEcheuesAnciens) {
            filtered = filtered.filter((tache) => !isEchuDePlusDeSeptJours(tache.date_echeance));
        }

        if (filtreEnCours) {
            filtered = filtered.filter((tache) => !ETAT_TERMINE.includes(tache.etat));
        }

        if (filtreEtats.length > 0) {
            filtered = filtered.filter((tache) => filtreEtats.includes(tache.etat));
        }

        if (filtreDossiers.length > 0) {
            filtered = filtered.filter((tache) => {
                const tacheFolders = relations
                    .filter((relation) => relation.tache === tache.id)
                    .map((relation) => relation.dossier);

                return filtreDossiers.some((dossierId) => tacheFolders.includes(dossierId));
            });
        }

        return filtered;
    };

    const getTachesTriees = () => {
        const sorted = [...getTachesFiltrees()];

        if (critereTri === 'date_echeance') {
            sorted.sort((a, b) => new Date(b.date_echeance) - new Date(a.date_echeance));
        } else if (critereTri === 'date_creation') {
            sorted.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
        } else if (critereTri === 'titre') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        }

        return sorted;
    };

    const getDossiersForTache = (tacheId) => {
        const dossiersIds = relations
            .filter((relation) => relation.tache === tacheId)
            .map((relation) => relation.dossier);

        return dossiers.filter((dossier) => dossiersIds.includes(dossier.id));
    };

    const getTachesForDossier = (dossierId) => {
        const tachesIds = relations
            .filter((relation) => relation.dossier === dossierId)
            .map((relation) => relation.tache);

        return taches.filter((tache) => tachesIds.includes(tache.id));
    };

    const addTache = (tache) => {
        const normalized = normalizeTache(tache);
        const error = validateTache(normalized);

        if (error) {
            throw new Error(error);
        }

        const newTache = {
            ...normalized,
            id: Math.max(...taches.map((item) => item.id), 0) + 1,
            date_creation: new Date().toISOString().split('T')[0]
        };

        setTaches([...taches, newTache]);
        return newTache;
    };

    const updateTache = (id, updatedTache) => {
        const current = taches.find((tache) => tache.id === id);
        if (!current) {
            return;
        }

        const merged = normalizeTache({ ...current, ...updatedTache, id });
        const error = validateTache(merged);

        if (error) {
            throw new Error(error);
        }

        setTaches(taches.map((tache) => (tache.id === id ? merged : tache)));
    };

    const deleteTache = (id) => {
        setTaches(taches.filter((tache) => tache.id !== id));
        setRelations(relations.filter((relation) => relation.tache !== id));
    };

    const addDossier = (dossier) => {
        const normalized = normalizeDossier(dossier);
        const error = validateDossier(normalized);

        if (error) {
            throw new Error(error);
        }

        const newDossier = {
            ...normalized,
            id: Math.max(...dossiers.map((item) => item.id), 0) + 1
        };

        setDossiers([...dossiers, newDossier]);
        return newDossier;
    };

    const updateDossier = (id, updatedDossier) => {
        const current = dossiers.find((dossier) => dossier.id === id);
        if (!current) {
            return;
        }

        const merged = normalizeDossier({ ...current, ...updatedDossier, id });
        const error = validateDossier(merged);

        if (error) {
            throw new Error(error);
        }

        setDossiers(dossiers.map((dossier) => (dossier.id === id ? merged : dossier)));
    };

    const deleteDossier = (id) => {
        setDossiers(dossiers.filter((dossier) => dossier.id !== id));
        setRelations(relations.filter((relation) => relation.dossier !== id));
    };

    const addRelation = (tacheId, dossierId) => {
        const tacheExists = taches.some((tache) => tache.id === tacheId);
        const dossierExists = dossiers.some((dossier) => dossier.id === dossierId);

        if (!tacheExists || !dossierExists) {
            return;
        }

        if (!relations.find((relation) => relation.tache === tacheId && relation.dossier === dossierId)) {
            setRelations([...relations, { tache: tacheId, dossier: dossierId }]);
        }
    };

    const removeRelation = (tacheId, dossierId) => {
        setRelations(relations.filter((relation) => !(relation.tache === tacheId && relation.dossier === dossierId)));
    };

    const toggleFiltreEtat = (etat) => {
        if (filtreEtats.includes(etat)) {
            setFiltreEtats(filtreEtats.filter((item) => item !== etat));
        } else {
            setFiltreEtats([...filtreEtats, etat]);
        }
    };

    const toggleFiltreDossier = (dossierId) => {
        if (filtreDossiers.includes(dossierId)) {
            setFiltreDossiers(filtreDossiers.filter((item) => item !== dossierId));
        } else {
            setFiltreDossiers([...filtreDossiers, dossierId]);
        }
    };

    const resetData = () => {
        const resetState = createInitialState();
        setTaches(resetState.taches);
        setDossiers(resetState.dossiers);
        setRelations(resetState.relations);
        setFiltreEnCours(true);
        setFiltreEtats([]);
        setFiltreDossiers([]);
        setCritereTri('date_echeance');
        setModeVue('taches');
        setCacherEcheuesAnciens(false);
    };

    const clearData = () => {
        setTaches([]);
        setDossiers([]);
        setRelations([]);
        setFiltreEnCours(true);
        setFiltreEtats([]);
        setFiltreDossiers([]);
        setCritereTri('date_echeance');
        setModeVue('taches');
        setCacherEcheuesAnciens(false);
    };

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const value = {
        taches, setTaches,
        dossiers, setDossiers,
        relations, setRelations,
        filtreEnCours, setFiltreEnCours,
        filtreEtats, setFiltreEtats,
        filtreDossiers, setFiltreDossiers,
        critereTri, setCritereTri,
        modeVue, setModeVue,
        cacherEcheuesAnciens, setCacherEcheuesAnciens,
        darkMode,
        setDarkMode,
        getTachesNonTerminees,
        getTachesFiltrees,
        getTachesTriees,
        getTacheFiltrees: getTachesFiltrees,
        getTacheTriees: getTachesTriees,
        getDossiersForTache,
        getTachesForDossier,

        addTache,
        updateTache,
        deleteTache,

        addDossier,
        updateDossier,
        deleteDossier,

        addRelation,
        removeRelation,

        toggleFiltreEtat,
        toggleFiltreDossier,

        resetData,
        clearData,
        toggleDarkMode
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};
