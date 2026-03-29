import React, { useContext, useState } from 'react';
import './Dossiers.css';
import { TodoContext } from '../../context/TodoContext';
import { DOSSIER_COLORS, DOSSIER_ICONS } from '../../data/enums';

function Dossiers() {
    const { dossiers, addDossier, updateDossier, deleteDossier, getTachesForDossier } = useContext(TodoContext);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        description: '',
        color: DOSSIER_COLORS[0],
        icon: ''
    });
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        color: DOSSIER_COLORS[0],
        icon: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    const startEdit = (dossier) => {
        setEditingId(dossier.id);
        setError('');
        setEditForm({
            title: dossier.title,
            description: dossier.description || '',
            color: dossier.color,
            icon: dossier.icon || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setError('');
    };

    const handleAdd = (e) => {
        e.preventDefault();

        try {
            addDossier(form);
            setForm({
                title: '',
                description: '',
                color: DOSSIER_COLORS[0],
                icon: ''
            });
            setError('');
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    const handleUpdate = (dossierId) => {
        try {
            updateDossier(dossierId, editForm);
            setEditingId(null);
            setError('');
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    return (
        <div className="py-2">
            <h2 className="mb-4 text-dark">Gestion des Dossiers</h2>
            {error && (
                <div className="alert alert-danger py-2">{error}</div>
            )}

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom">
                            <h5 className="mb-0">Nouveau Dossier</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAdd}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Intitulé *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleFormChange}
                                        placeholder="Ex: Factures"
                                        minLength={3}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={form.description}
                                        onChange={handleFormChange}
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small">Couleur *</label>
                                    <select
                                        name="color"
                                        className="form-select"
                                        value={form.color}
                                        onChange={handleFormChange}
                                    >
                                        {DOSSIER_COLORS.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small">Pictogramme</label>
                                    <select
                                        name="icon"
                                        className="form-select"
                                        value={form.icon}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Aucun</option>
                                        {DOSSIER_ICONS.map((icon) => (
                                            <option key={icon} value={icon}>
                                                {icon}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-dark w-100">Ajouter le dossier</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="row">
                        {dossiers.map((dossier) => (
                            <div key={dossier.id} className="col-md-6 mb-3">
                                <div className="card shadow-sm h-100" style={{ borderLeft: `5px solid ${dossier.color}` }}>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        {editingId === dossier.id ? (
                                            <div className="w-100">
                                                <div className="mb-2">
                                                    <label className="form-label small">Intitulé</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="title"
                                                        minLength={3}
                                                        value={editForm.title}
                                                        onChange={handleEditFormChange}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label small">Description</label>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        rows="2"
                                                        name="description"
                                                        value={editForm.description}
                                                        onChange={handleEditFormChange}
                                                    ></textarea>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label small">Couleur</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        name="color"
                                                        value={editForm.color}
                                                        onChange={handleEditFormChange}
                                                    >
                                                        {DOSSIER_COLORS.map((color) => (
                                                            <option key={color} value={color}>
                                                                {color}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label small">Pictogramme</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        name="icon"
                                                        value={editForm.icon}
                                                        onChange={handleEditFormChange}
                                                    >
                                                        <option value="">Aucun</option>
                                                        {DOSSIER_ICONS.map((icon) => (
                                                            <option key={icon} value={icon}>
                                                                {icon}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-dark" onClick={() => handleUpdate(dossier.id)}>
                                                        Sauver
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <h5 className="card-title mb-0" style={{ color: '#333' }}>{dossier.title}</h5>
                                                    <small className="text-muted d-block">{dossier.description || 'Sans description'}</small>
                                                    <small className="text-muted d-block">Tâches liées: {getTachesForDossier(dossier.id).length}</small>
                                                    {dossier.icon && <small className="text-muted d-block">Icône: {dossier.icon}</small>}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() => startEdit(dossier)}
                                                        title="Éditer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
                                                            if (window.confirm(`Supprimer le dossier "${dossier.title}" ?`)) {
                                                                deleteDossier(dossier.id);
                                                            }
                                                        }}
                                                        title="Supprimer"
                                                    >
                                                        Del
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dossiers;
