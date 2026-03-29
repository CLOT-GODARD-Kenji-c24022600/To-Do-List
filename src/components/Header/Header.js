import React, { useContext } from 'react';
import './Header.css';
import { TodoContext } from '../../context/TodoContext';
import { ETATS } from '../../data/enums';

function Header() {
    const { 
        taches, 
        getTachesNonTerminees, 
        modeVue, 
        setModeVue,
        resetData
    } = useContext(TodoContext);

    const totalTaches = taches.length;
    const nonTerminees = getTachesNonTerminees().length;

    // Comptage par état
    const compterParEtat = () => {
        const counts = {};
        Object.values(ETATS).forEach(etat => {
            counts[etat] = taches.filter(t => t.etat === etat).length;
        });
        return counts;
    };

    const etatCounts = compterParEtat();

    const handleReset = () => {
        if (window.confirm('Remettre les données d\'origine ? Les changements non sauvegardés seront perdus.')) {
            resetData();
        }
    };

    return (
        <header className="header bg-light border-bottom">
            <div className="container-fluid py-3">
                <div className="row align-items-center mb-3">
                    <div className="col-md-4">
                        <h1 className="h3 mb-0">Tableau de tâches</h1>
                    </div>

                    <div className="col-md-4">
                        <div className="d-flex gap-3">
                            <div>
                                <small className="text-muted d-block">Total :</small>
                                <span className="badge bg-secondary fs-6">{totalTaches}</span>
                            </div>
                            <div>
                                <small className="text-muted d-block">En cours :</small>
                                <span className="badge bg-info fs-6">{nonTerminees}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 text-end">
                        <button 
                            className={`btn btn-sm me-2 ${modeVue === 'taches' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setModeVue('taches')}
                        >
                            Tâches
                        </button>
                        <button 
                            className={`btn btn-sm me-2 ${modeVue === 'dossiers' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setModeVue('dossiers')}
                        >
                            Dossiers
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleReset}>
                            Réinitialiser
                        </button>
                    </div>
                </div>

                <div className="row mt-3 pt-2 border-top">
                    <div className="col-12">
                        <small className="text-muted d-block mb-3 fw-bold">Répartition :</small>
                        <div className="d-flex gap-3 flex-wrap">
                            {Object.entries(etatCounts).map(([etat, count]) => (
                                <div key={etat} className="d-flex align-items-center gap-2">
                                    <span style={{ minWidth: '80px', fontSize: '13px' }}>{etat}:</span>
                                    <span style={{ fontSize: '12px', padding: '6px 10px', fontWeight: '600', color: '#666', border: '2px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', display: 'inline-block' }}>
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
