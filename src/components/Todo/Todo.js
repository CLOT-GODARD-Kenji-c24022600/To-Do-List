import React, { useContext } from 'react';
import './Todo.css';
import { TodoContext } from '../../context/TodoContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import List from '../List/List';
import Filtre from '../Filtre/Filtre';
import Tri from '../Tri/Tri';
import Dossiers from '../Dossiers/Dossiers';

function Todo() {
    const { modeVue } = useContext(TodoContext);

    return (
        <div className="d-flex flex-column vh-100">
            <Header />
            
            {modeVue === 'taches' && (
                <>
                    <div className="bg-white border-bottom py-2">
                        <div className="container-fluid">
                            <div className="d-flex gap-3 flex-wrap align-items-center">
                                <div style={{ minWidth: '250px' }}>
                                    <Tri />
                                </div>
                                <div className="flex-grow-1">
                                    <Filtre />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto">
                        <List />
                    </div>
                </>
            )}

            {modeVue === 'dossiers' && (
                <div className="flex-grow-1 overflow-auto">
                    <Dossiers />
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default Todo;
