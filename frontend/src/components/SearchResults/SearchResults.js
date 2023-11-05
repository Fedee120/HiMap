import React from 'react';
import './SearchResults.scss';

function SearchResults({ results }) {
    // Verificar si 'results' es un arreglo
    if (!Array.isArray(results)) {
        return (
            <div className="SearchResults">
                <p>Los resultados no son válidos.</p>
            </div>
        );
    }

    // Ordenamos los resultados por score de forma ascendente
    const sortedResults = results.sort((a, b) => a.score - b.score);

    return (
        <div className="SearchResults">
            <div className="file-list">
                {sortedResults.map((result, index) => (
                    <div key={index} className="file-item">
                        <div className="file-content">
                            <p><strong>ID:</strong> {result.id}</p>
                            <p><strong>Score:</strong> {result.score}</p>
                            <p><strong>Sentence:</strong> {result.sentence}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
