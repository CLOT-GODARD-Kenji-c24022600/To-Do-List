import React, { useContext } from 'react';
import './List.css';
import { TodoContext } from '../../context/TodoContext';
import Tache from '../Tache/Tache';

function List() {
    // 1. On met || {} au cas où le contexte n'est pas encore prêt
    const { getTacheTriees } = useContext(TodoContext) || {};

    // 2. On vérifie que la fonction existe, et on s'assure qu'elle renvoie toujours un tableau (même vide)
    const tachesAffichees = getTacheTriees ? (getTacheTriees() || []) : [];

    return (
        <div className="container-fluid" style={{ padding: '20px 15px' }}>
            {tachesAffichees.length > 0 ? (
                <div>
                    {tachesAffichees.map(tache => (
                        <Tache key={tache.id} tache={tache} />
                    ))}
                </div>
            ) : (
                <div className="alert alert-info text-center py-5 mx-auto" style={{ maxWidth: '500px' }}>
                    <p className="mb-0">Aucune tâche à afficher</p>
                </div>
            )}
        </div>
    );
}

export default List;