import React, { useContext, useState } from 'react';
import './Filtre.css';
import { TodoContext } from '../../context/TodoContext';
import { ETATS } from '../../data/enums';

function Filtre() {
    const { 
        dossiers,
        filtreEnCours,
        setFiltreEnCours,
        filtreEtats,
        toggleFiltreEtat,
        filtreDossiers,
        toggleFiltreDossier,
        cacherEcheuesAnciens,
        setCacherEcheuesAnciens
    } = useContext(TodoContext);

    const [showEtats, setShowEtats] = useState(false);
    const [showDossiers, setShowDossiers] = useState(false);

    return (
        <div className="filtre-container d-flex gap-2 flex-wrap align-items-center">
            {/* Filtre En Cours */}
            <button 
                className={`btn btn-sm ${filtreEnCours ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFiltreEnCours(!filtreEnCours)}
                title="Afficher ou masquer les tâches terminées"
            >
                Tâches en cours
            </button>

            {/* Masquer anciennes échues */}
            <label className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2 mb-0 cursor-pointer">
                <input
                    type="checkbox"
                    checked={cacherEcheuesAnciens}
                    onChange={(e) => setCacherEcheuesAnciens(e.target.checked)}
                    title="Masquer les tâches échues depuis plus de 7 jours"
                />
                <span>Archiver {'>'}7j</span>
            </label>

            {/* Filtre Etats */}
            <div className="dropdown">
                <button 
                    className={`btn btn-sm ${filtreEtats.length > 0 ? 'btn-dark' : 'btn-outline-dark'} dropdown-toggle`}
                    onClick={() => setShowEtats(!showEtats)}
                    aria-label="Filtrer par état"
                >
                    États {filtreEtats.length > 0 && <span className="badge bg-danger ms-1">{filtreEtats.length}</span>}
                </button>
                {showEtats && (
                    <div className="dropdown-menu show" style={{ display: 'block' }}>
                        {Object.values(ETATS).map(etat => {
                            const colorMap = {
                                'Nouveau': '#6c757d',
                                'En cours': '#0dcaf0',
                                'En attente': '#ffc107',
                                'Réussi': '#198754',
                                'Abandonné': '#dc3545'
                            };
                            const color = colorMap[etat] || '#6c757d';
                            return (
                                <label key={etat} className="dropdown-item" style={{ fontSize: '13px' }}>
                                    <input
                                        type="checkbox"
                                        checked={filtreEtats.includes(etat)}
                                        onChange={() => toggleFiltreEtat(etat)}
                                        className="me-2"
                                    />
                                    <span style={{ color: color, fontWeight: '600' }}>{etat}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Filtre Dossiers */}
            <div className="dropdown">
                <button 
                    className={`btn btn-sm ${filtreDossiers.length > 0 ? 'btn-dark' : 'btn-outline-dark'} dropdown-toggle`}
                    onClick={() => setShowDossiers(!showDossiers)}
                    aria-label="Filtrer par dossier"
                >
                    Dossiers {filtreDossiers.length > 0 && <span className="badge bg-danger ms-1">{filtreDossiers.length}</span>}
                </button>
                {showDossiers && (
                    <div className="dropdown-menu show" style={{ display: 'block' }}>
                        {dossiers.map(dossier => (
                            <label key={dossier.id} className="dropdown-item" style={{ fontSize: '13px' }}>
                                <input
                                    type="checkbox"
                                    checked={filtreDossiers.includes(dossier.id)}
                                    onChange={() => toggleFiltreDossier(dossier.id)}
                                    className="me-2"
                                />
                                <span 
                                    style={{ 
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        border: `2px solid ${dossier.color}`,
                                        borderRadius: '2px',
                                        marginRight: '6px',
                                        backgroundColor: dossier.color
                                    }}
                                ></span>
                                {dossier.title}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Filtre;
