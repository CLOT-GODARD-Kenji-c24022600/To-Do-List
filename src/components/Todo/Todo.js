import React, { useContext, useEffect } from 'react';
import './Todo.css';
import { TodoContext } from '../../context/TodoContext';
import List from '../List/List';
import Filtre from '../Filtre/Filtre';
import Tri from '../Tri/Tri';
import Dossiers from '../Dossiers/Dossiers';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

function Todo() {
    // On récupère le mode de vue (taches ou dossiers) depuis le contexte
    const { modeVue, darkMode } = useContext(TodoContext);

    useEffect(() => {
        document.body.classList.toggle('theme-dark', darkMode);
    }, [darkMode]);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            
            <main className="container-fluid flex-grow-1 py-4">
                {modeVue === 'taches' ? (
                    // --- VUE DES TACHES ---
                    <div className="mx-auto" style={{ maxWidth: '1000px' }}>
                        <div className="row align-items-center mb-3">
                            <div className="col-md-8 mb-2 mb-md-0">
                                <Filtre />
                            </div>
                            <div className="col-md-4">
                                <Tri />
                            </div>
                        </div>
                        <List />
                    </div>
                ) : (
                    // --- VUE DES DOSSIERS ---
                    <div className="mx-auto" style={{ maxWidth: '1000px' }}>
                        <Dossiers />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Todo;