import React, { useState, useContext } from 'react';
import './Dossiers.css';
import { TodoContext } from '../../context/TodoContext';

function Dossiers() {
    const { dossiers, addDossier, updateDossier, deleteDossier } = useContext(TodoContext);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', color: 'orange' });

    const colors = ['orange', 'pink', 'bluesky', 'green', 'blue', 'red', 'purple', 'gray', 'yellow', 'teal'];

    const handleEdit = (dossier) => {
        setEditId(dossier.id);
        setFormData({ title: dossier.title, description: dossier.description, color: dossier.color });
    };

    const handleSave = () => {
        if (!formData.title.trim() || formData.title.trim().length < 3) {
            alert('Le titre doit contenir au moins 3 caractères');
            return;
        }
        updateDossier(editId, formData);
        setEditId(null);
        setFormData({ title: '', description: '', color: 'orange' });
    };

    const handleCancel = () => {
        setEditId(null);
        setFormData({ title: '', description: '', color: 'orange' });
    };

    const handleAdd = () => {
        if (!formData.title.trim() || formData.title.trim().length < 3) {
            alert('Le titre doit contenir au moins 3 caractères');
            return;
        }
        addDossier(formData);
        setFormData({ title: '', description: '', color: 'orange' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Supprimer ce dossier ?')) {
            deleteDossier(id);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="row g-3 mb-4">
                {dossiers.map(dossier => (
                    <div key={dossier.id} className="col-sm-6 col-lg-4">
                        <div className="card h-100 border-start" style={{ borderLeftColor: dossier.color, borderLeftWidth: '4px' }}>
                            {editId === dossier.id ? (
                                <div className="card-body">
                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Titre"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <textarea
                                            className="form-control form-control-sm"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Description"
                                            rows="2"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-select form-select-sm"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        >
                                            {colors.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="d-grid gap-2 d-sm-flex">
                                        <button onClick={handleSave} className="btn btn-sm btn-success flex-grow-1">Sauvegarder</button>
                                        <button onClick={handleCancel} className="btn btn-sm btn-outline-secondary flex-grow-1">Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0 text-dark">{dossier.title}</h5>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button onClick={() => handleEdit(dossier)} className="btn btn-outline-secondary" title="Éditer">✎</button>
                                            <button onClick={() => handleDelete(dossier.id)} className="btn btn-outline-danger" title="Supprimer">✕</button>
                                        </div>
                                    </div>
                                    {dossier.description && <p className="card-text small text-muted">{dossier.description}</p>}
                                    <div className="mt-3">
                                        <span className="badge" style={{ backgroundColor: dossier.color, fontSize: '11px' }}>{dossier.color.toUpperCase()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-info mb-3">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0">Ajouter un dossier</h5>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Titre (min 3 caractères)"
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Description"
                            rows="2"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><small>Couleur</small></label>
                        <select
                            className="form-select"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        >
                            {colors.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleAdd} className="btn btn-info w-100">Ajouter</button>
                </div>
            </div>
        </div>
    );
}

export default Dossiers;
