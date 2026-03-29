import React, { useState, useContext } from 'react';
import './Tache.css';
import { TodoContext } from '../../context/TodoContext';

function Tache({ tache }) {
    const { getDossiersForTache, updateTache, deleteTache, toggleFiltreDossier } = useContext(TodoContext);
    const [expanded, setExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: tache.title,
        description: tache.description,
        date_echeance: tache.date_echeance,
        etat: tache.etat
    });

    const dossiers = getDossiersForTache(tache.id);
    const first2Folders = dossiers.slice(0, 2);
    const allFolders = dossiers;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        updateTache(tache.id, formData);
        setEditMode(false);
    };

    const handleCancel = () => {
        setFormData({
            title: tache.title,
            description: tache.description,
            date_echeance: tache.date_echeance,
            etat: tache.etat
        });
        setEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    if (editMode) {
        return (
            <div className="card border-start border-3 mb-2">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Titre</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="2"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date d'échéance</label>
                        <input
                            type="date"
                            name="date_echeance"
                            className="form-control"
                            value={formData.date_echeance}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Statut</label>
                        <select
                            name="etat"
                            className="form-select"
                            value={formData.etat}
                            onChange={handleInputChange}
                        >
                            <option value="Nouveau">Nouveau</option>
                            <option value="En cours">En cours</option>
                            <option value="En attente">En attente</option>
                            <option value="Réussi">Réussi</option>
                            <option value="Abandonné">Abandonné</option>
                        </select>
                    </div>

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                        <button className="btn btn-success" onClick={handleSave}>Sauvegarder</button>
                        <button className="btn btn-outline-secondary" onClick={handleCancel}>Annuler</button>
                    </div>
                </div>
            </div>
        );
    }

    const getEtatBadgeStyle = () => {
        const colorMap = {
            'Nouveau': '#6c757d',
            'En cours': '#0dcaf0',
            'En attente': '#ffc107',
            'Réussi': '#198754',
            'Abandonné': '#dc3545'
        };
        const color = colorMap[tache.etat] || '#6c757d';
        return {
            fontSize: '12px',
            padding: '6px 10px',
            fontWeight: '600',
            color: color,
            border: `2px solid ${color}`,
            borderRadius: '4px',
            backgroundColor: '#fff',
            display: 'inline-block'
        };
    };

    return (
        <div className="card mb-2">
            <div className="card-header p-0 bg-white">
                <button
                    className="w-100 d-flex align-items-center text-start p-3 text-decoration-none bg-transparent border-0 tache-toggle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(!expanded)}
                    title={expanded ? 'Masquer les détails' : 'Voir les détails'}
                    aria-label={expanded ? 'Masquer les détails' : 'Voir les détails'}
                >
                    <span 
                        style={{ 
                            marginRight: '10px',
                            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s',
                            color: '#333'
                        }}
                    >
                        ▶
                    </span>
                    <div className="flex-grow-1">
                        <h5 className="mb-1 text-dark">{tache.title}</h5>
                        <div className="small text-muted d-flex gap-2 align-items-center">
                            <span>{formatDate(tache.date_echeance)}</span>
                            <span style={getEtatBadgeStyle()}>
                                {tache.etat}
                            </span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Mode Simple - Affiche les 2 premiers dossiers */}
            {!expanded && first2Folders.length > 0 && (
                <div className="card-body pt-3 pb-3 border-top" style={{ backgroundColor: '#fafbfc' }}>
                    <small className="text-muted d-block mb-3 fw-bold">Dossiers:</small>
                    <div className="d-flex gap-3 flex-wrap">
                        {first2Folders.map(dossier => (
                            <span
                                key={dossier.id}
                                style={{ 
                                    display: 'inline-block',
                                    fontSize: '14px',
                                    padding: '8px 12px',
                                    fontWeight: '600',
                                    color: dossier.color,
                                    border: `2px solid ${dossier.color}`,
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    transition: 'all 0.2s ease'
                                }}
                                className="dossier-badge"
                                title="Cliquez pour filtrer"
                            >
                                {dossier.title}
                            </span>
                        ))}
                        {dossiers.length > 2 && (
                            <span style={{ 
                                display: 'inline-block',
                                fontSize: '14px', 
                                padding: '8px 12px', 
                                fontWeight: '600',
                                color: '#666',
                                border: '2px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: '#fff'
                            }}>
                                +{dossiers.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Mode Complet */}
            {expanded && (
                <div className="card-body">
                    {tache.description && (
                        <div className="mb-3">
                            <strong>Description</strong>
                            <p className="mb-0 mt-1">{tache.description}</p>
                        </div>
                    )}

                    {allFolders.length > 0 && (
                        <div className="mb-3">
                            <strong>Dossiers</strong>
                            <div className="d-flex gap-2 flex-wrap mt-2">
                                {allFolders.map(dossier => (
                                    <span
                                        key={dossier.id}
                                        style={{ 
                                            display: 'inline-block',
                                            fontSize: '14px',
                                            padding: '8px 12px',
                                            fontWeight: '600',
                                            color: dossier.color,
                                            border: `2px solid ${dossier.color}`,
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            backgroundColor: '#fff'
                                        }}
                                        onClick={() => toggleFiltreDossier(dossier.id)}
                                        title="Filtrer sur ce dossier"
                                    >
                                        {dossier.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {tache.equipiers && tache.equipiers.length > 0 && (
                        <div className="mb-3">
                            <strong>Équipiers</strong>
                            <ul className="small mb-0 mt-1">
                                {tache.equipiers.map((equipier, idx) => (
                                    <li key={idx}>{equipier.name || equipier}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={handleEdit}>
                            Éditer
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                                    deleteTache(tache.id);
                                }
                            }}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tache;
