import React, { useContext } from 'react';
import './Filtre.css';
import { TodoContext } from '../../context/TodoContext';
import { ETATS } from '../../data/enums';

function Filtre() {
    const {
        dossiers = [],
        filtreEnCours, setFiltreEnCours,
        filtreEtats = [], toggleFiltreEtat,
        filtreDossiers = [], toggleFiltreDossier,
        cacherEcheuesAnciens, setCacherEcheuesAnciens
    } = useContext(TodoContext) || {};

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body py-2 px-3">
                <div className="d-flex align-items-start gap-4 flex-wrap">
                    <strong className="text-muted" style={{ fontSize: '14px' }}>Filtres :</strong>
                    
                    <div className="form-check form-switch m-0 pt-1">
                        <input 
                            className="form-check-input cursor-pointer" 
                            type="checkbox" 
                            id="filtreEnCours" 
                            checked={filtreEnCours || false}
                            onChange={(e) => setFiltreEnCours && setFiltreEnCours(e.target.checked)}
                        />
                        <label className="form-check-label cursor-pointer" htmlFor="filtreEnCours" style={{ fontSize: '14px' }}>
                            Masquer les terminées
                        </label>
                    </div>

                    <div className="form-check form-switch m-0 pt-1">
                        <input 
                            className="form-check-input cursor-pointer" 
                            type="checkbox" 
                            id="cacherAnciens" 
                            checked={cacherEcheuesAnciens || false}
                            onChange={(e) => setCacherEcheuesAnciens && setCacherEcheuesAnciens(e.target.checked)}
                        />
                        <label className="form-check-label cursor-pointer" htmlFor="cacherAnciens" style={{ fontSize: '14px' }}>
                            Masquer obsolètes (&gt; 7j)
                        </label>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        <details className="border rounded px-2 py-1 bg-white">
                            <summary style={{ cursor: 'pointer', userSelect: 'none', fontSize: '14px' }}>
                                États ({filtreEtats.length})
                            </summary>
                            <div className="pt-2 d-flex flex-column gap-1">
                                {Object.values(ETATS).map((etat) => (
                                    <label key={etat} className="form-check-label" style={{ fontSize: '14px' }}>
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={filtreEtats.includes(etat)}
                                            onChange={() => toggleFiltreEtat && toggleFiltreEtat(etat)}
                                        />
                                        {etat}
                                    </label>
                                ))}
                            </div>
                        </details>

                        <details className="border rounded px-2 py-1 bg-white">
                            <summary style={{ cursor: 'pointer', userSelect: 'none', fontSize: '14px' }}>
                                Dossiers ({filtreDossiers.length})
                            </summary>
                            <div className="pt-2 d-flex flex-column gap-1">
                                {dossiers.map((dossier) => (
                                    <label key={dossier.id} className="form-check-label" style={{ fontSize: '14px' }}>
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={filtreDossiers.includes(dossier.id)}
                                            onChange={() => toggleFiltreDossier && toggleFiltreDossier(dossier.id)}
                                        />
                                        <span style={{ color: dossier.color, marginRight: '6px' }}>■</span>
                                        {dossier.title}
                                    </label>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filtre;