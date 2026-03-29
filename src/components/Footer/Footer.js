import React, { useState, useContext } from 'react';
import './Footer.css';
import { TodoContext } from '../../context/TodoContext';
import { DOSSIER_COLORS, DOSSIER_ICONS, ETATS } from '../../data/enums';

function Footer() {
    const { addDossier, addRelation, addTache, dossiers } = useContext(TodoContext);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [error, setError] = useState('');

    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        date_echeance: '',
        etat: ETATS.NOUVEAU,
        equipiers: '',
        dossierIds: []
    });

    const [folderForm, setFolderForm] = useState({
        title: '',
        description: '',
        color: DOSSIER_COLORS[0],
        icon: ''
    });

    const resetTaskForm = () => {
        setTaskForm({
            title: '',
            description: '',
            date_echeance: '',
            etat: ETATS.NOUVEAU,
            equipiers: '',
            dossierIds: []
        });
        setError('');
    };

    const resetFolderForm = () => {
        setFolderForm({
            title: '',
            description: '',
            color: DOSSIER_COLORS[0],
            icon: ''
        });
        setError('');
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        resetTaskForm();
    };

    const closeFolderModal = () => {
        setShowFolderModal(false);
        resetFolderForm();
    };

    const handleTaskInputChange = (e) => {
        const { name, value } = e.target;
        setTaskForm({
            ...taskForm,
            [name]: value
        });
    };

    const handleFolderInputChange = (e) => {
        const { name, value } = e.target;
        setFolderForm({
            ...folderForm,
            [name]: value
        });
    };

    const toggleTaskDossier = (dossierId) => {
        if (taskForm.dossierIds.includes(dossierId)) {
            setTaskForm({
                ...taskForm,
                dossierIds: taskForm.dossierIds.filter((id) => id !== dossierId)
            });
            return;
        }

        setTaskForm({
            ...taskForm,
            dossierIds: [...taskForm.dossierIds, dossierId]
        });
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (taskForm.title.trim().length < 5) {
            setError('Le titre doit contenir au moins 5 caractères.');
            return;
        }

        if (!taskForm.date_echeance) {
            setError("La date d'échéance est obligatoire.");
            return;
        }

        const equipiers = taskForm.equipiers
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean);

        try {
            const created = addTache({
                title: taskForm.title,
                description: taskForm.description,
                date_echeance: taskForm.date_echeance,
                etat: taskForm.etat,
                equipiers
            });

            taskForm.dossierIds.forEach((dossierId) => {
                addRelation(created.id, dossierId);
            });

            closeTaskModal();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    const handleFolderSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            addDossier({
                title: folderForm.title,
                description: folderForm.description,
                color: folderForm.color,
                icon: folderForm.icon
            });

            closeFolderModal();
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    return (
        <footer className="footer bg-light border-top py-3">
            <div className="container-fluid d-flex justify-content-end">
                <div className="footer-actions">
                    <div className="footer-action-group">
                        <button
                            className="footer-circle-btn footer-folder-btn"
                            onClick={() => setShowFolderModal(true)}
                            title="Ajouter un dossier"
                            aria-label="Ajouter un dossier"
                        >
                            <span className="footer-folder-icon" aria-hidden="true"></span>
                        </button>
                        <span className="footer-action-label">Dossier</span>
                    </div>

                    <div className="footer-action-group">
                        <button
                            className="footer-circle-btn footer-task-btn"
                            onClick={() => setShowTaskModal(true)}
                            title="Ajouter une tâche"
                            aria-label="Ajouter une tâche"
                        >
                            <span className="footer-plus" aria-hidden="true">+</span>
                        </button>
                        <span className="footer-action-label">Tâche</span>
                    </div>
                </div>
            </div>

            {showTaskModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeTaskModal}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title">Ajouter une tâche</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeTaskModal}
                                    aria-label="Fermer"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleTaskSubmit}>
                                    {error && (
                                        <div className="alert alert-danger py-2">{error}</div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Intitulé *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="form-control"
                                            value={taskForm.title}
                                            onChange={handleTaskInputChange}
                                            placeholder="Ex: Préparer la démo"
                                            minLength={5}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            value={taskForm.description}
                                            onChange={handleTaskInputChange}
                                            placeholder="Notes, contexte, points importants..."
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="date_echeance" className="form-label">Date d'échéance *</label>
                                        <input
                                            type="date"
                                            id="date_echeance"
                                            name="date_echeance"
                                            className="form-control"
                                            value={taskForm.date_echeance}
                                            onChange={handleTaskInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="etat" className="form-label">Statut</label>
                                        <select
                                            id="etat"
                                            name="etat"
                                            className="form-select"
                                            value={taskForm.etat}
                                            onChange={handleTaskInputChange}
                                        >
                                            {Object.values(ETATS).map(etat => (
                                                <option key={etat} value={etat}>
                                                    {etat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="equipiers" className="form-label">Équipiers</label>
                                        <input
                                            type="text"
                                            id="equipiers"
                                            name="equipiers"
                                            className="form-control"
                                            value={taskForm.equipiers}
                                            onChange={handleTaskInputChange}
                                            placeholder="Paul, Marie, Jean"
                                        />
                                        <small className="text-muted">Séparez les noms avec des virgules.</small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Dossiers liés (optionnel)</label>
                                        <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {dossiers.length === 0 && (
                                                <small className="text-muted">Aucun dossier disponible.</small>
                                            )}
                                            {dossiers.map((dossier) => (
                                                <div key={dossier.id} className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`task-folder-${dossier.id}`}
                                                        checked={taskForm.dossierIds.includes(dossier.id)}
                                                        onChange={() => toggleTaskDossier(dossier.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`task-folder-${dossier.id}`}>
                                                        {dossier.title}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                                        <button type="submit" className="btn btn-dark">
                                            Ajouter
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={closeTaskModal}>
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showFolderModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeFolderModal}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title">Ajouter un dossier</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeFolderModal}
                                    aria-label="Fermer"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleFolderSubmit}>
                                    {error && (
                                        <div className="alert alert-danger py-2">{error}</div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="folder-title" className="form-label">Intitulé *</label>
                                        <input
                                            type="text"
                                            id="folder-title"
                                            name="title"
                                            className="form-control"
                                            value={folderForm.title}
                                            onChange={handleFolderInputChange}
                                            minLength={3}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="folder-description" className="form-label">Description</label>
                                        <textarea
                                            id="folder-description"
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            value={folderForm.description}
                                            onChange={handleFolderInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="folder-color" className="form-label">Couleur *</label>
                                        <select
                                            id="folder-color"
                                            name="color"
                                            className="form-select"
                                            value={folderForm.color}
                                            onChange={handleFolderInputChange}
                                        >
                                            {DOSSIER_COLORS.map((color) => (
                                                <option key={color} value={color}>
                                                    {color}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="folder-icon" className="form-label">Pictogramme</label>
                                        <select
                                            id="folder-icon"
                                            name="icon"
                                            className="form-select"
                                            value={folderForm.icon}
                                            onChange={handleFolderInputChange}
                                        >
                                            <option value="">Aucun</option>
                                            {DOSSIER_ICONS.map((icon) => (
                                                <option key={icon} value={icon}>
                                                    {icon}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                                        <button type="submit" className="btn btn-dark">
                                            Ajouter
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={closeFolderModal}>
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;
