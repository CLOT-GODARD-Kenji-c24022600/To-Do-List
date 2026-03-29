import React, { useContext } from 'react';
import './Header.css';
import { TodoContext } from '../../context/TodoContext';
import { ETATS } from '../../data/enums';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Header() {
    // 1. On ajoute des valeurs par défaut au cas où le contexte met du temps à charger
    const { 
        taches = [], 
        getTachesNonTerminees, 
        modeVue = 'taches', 
        setModeVue,
        resetData,
        clearData,
        darkMode,
        toggleDarkMode
    } = useContext(TodoContext) || {};

    // 2. On sécurise la lecture de la taille
    const totalTaches = taches?.length || 0;
    
    // 3. On vérifie que la fonction existe bien avant de l'appeler
    const nonTerminees = getTachesNonTerminees ? getTachesNonTerminees().length : 0;

    // Comptage par état (avec sécurité sur "taches")
    const compterParEtat = () => {
        const counts = {};
        Object.values(ETATS).forEach(etat => {
            counts[etat] = (taches || []).filter(t => t.etat === etat).length;
        });
        return counts;
    };

    const etatCounts = compterParEtat();

    const chartData = {
        labels: Object.values(ETATS),
        datasets: [
            {
                label: 'Répartition par état',
                data: Object.values(ETATS).map((etat) => etatCounts[etat] || 0),
                backgroundColor: ['#6c757d', '#0dcaf0', '#198754', '#ffc107', '#dc3545'],
                borderColor: darkMode ? '#1a2230' : '#ffffff',
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 10,
                    padding: 8,
                    color: darkMode ? '#a9bedc' : '#5b6675',
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    const handleReset = () => {
        if (resetData && window.confirm('Remettre les données d\'origine ? Les changements non sauvegardés seront perdus.')) {
            resetData();
        }
    };

    const handleClear = () => {
        if (clearData && window.confirm('Êtes-vous sûr(e) de repartir de zéro ?')) {
            clearData();
        }
    };

    return (
        <header className="header bg-light border-bottom">
            <div className="container-fluid py-3">
                <div className="row align-items-center mb-3">
                    <div className="col-md-4">
                        <h1 className="h3 mb-0">To-do List</h1>
                    </div>

                    <div className="col-md-4">
                        <div className="header-kpi-grid">
                            <div className="header-kpi-card header-kpi-card-total">
                                <small className="header-kpi-label">Total</small>
                                <strong className="header-kpi-value">{totalTaches}</strong>
                                <span className="header-kpi-hint">Toutes tâches</span>
                            </div>
                            <div className="header-kpi-card header-kpi-card-open">
                                <small className="header-kpi-label">En cours</small>
                                <strong className="header-kpi-value">{nonTerminees}</strong>
                                <span className="header-kpi-hint">Non terminées</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex justify-content-end align-items-center gap-2">
                        <button 
                            className={`btn btn-sm ${modeVue === 'taches' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setModeVue && setModeVue('taches')}
                        >
                            Tâches
                        </button>
                        <button 
                            className={`btn btn-sm ${modeVue === 'dossiers' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setModeVue && setModeVue('dossiers')}
                        >
                            Dossiers
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleReset}>
                            Backup
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>
                            Reset
                        </button>
                        <button
                            className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
                            onClick={() => toggleDarkMode && toggleDarkMode()}
                            title="Activer ou désactiver le mode sombre"
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="row mt-3 pt-2 border-top">
                    <div className="col-lg-6 mb-3 mb-lg-0">
                        <small className="text-muted d-block mb-3 fw-bold">Répartition :</small>
                        <div className="header-repartition-list">
                            {Object.entries(etatCounts).map(([etat, count]) => (
                                <div key={etat} className="header-repartition-item">
                                    <span className="header-repartition-label">{etat}:</span>
                                    <span className="header-repartition-value">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <small className="header-chart-title d-block mb-2 fw-bold">Camembert des états :</small>
                        <div className="header-chart-wrap">
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;