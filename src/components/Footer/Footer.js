import React, { useState, useContext } from 'react';
import './Footer.css';
import { TodoContext } from '../../context/TodoContext';
import { ETATS } from '../../data/enums';

function Footer() {
    const { addTache } = useContext(TodoContext);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_echeance: '',
        etat: ETATS.NOUVEAU,
        equipiers: []
    });

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            title: '',
            description: '',
            date_echeance: '',
            etat: ETATS.NOUVEAU,
            equipiers: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim() || formData.title.trim().length < 5) {
            alert('Le titre doit contenir au moins 5 caractères');
            return;
        }

        if (!formData.date_echeance) {
            alert('La date d\'échéance est obligatoire');
            return;
        }

        const newTache = {
            ...formData,
            equipiers: formData.equipiers.length > 0 
                ? formData.equipiers.split(',').map(name => ({ name: name.trim() }))
                : []
        };

        addTache(newTache);
        handleCloseModal();
    };

    return (
        <footer className="footer bg-light border-top py-3">
            <div className="container-fluid d-flex justify-content-end">
                <button 
                    className="btn btn-dark rounded-pill shadow"
                    onClick={handleOpenModal} 
                    title="Ajouter une tâche" 
                    aria-label="Ajouter une tâche"
                    style={{ width: '48px', height: '48px' }}
                >
                    +
                </button>
            </div>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseModal}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title">Ajouter une tâche</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCloseModal} 
                                    aria-label="Fermer"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Intitulé *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Préparer la démo"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            value={formData.description}
                                            onChange={handleInputChange}
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
                                            value={formData.date_echeance}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="etat" className="form-label">Statut</label>
                                        <select
                                            id="etat"
                                            name="etat"
                                            className="form-select"
                                            value={formData.etat}
                                            onChange={handleInputChange}
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
                                            value={formData.equipiers}
                                            onChange={(e) => setFormData({ ...formData, equipiers: e.target.value })}
                                            placeholder="Paul, Marie, Jean"
                                        />
                                    </div>

                                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                                        <button type="submit" className="btn btn-dark">
                                            Ajouter
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>
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
