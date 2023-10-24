import React, { useState } from 'react';
import './SearchResults.scss';

function SearchResults({ results }) {
    const [selectedId, setSelectedId] = useState(null);

    // Verificar si 'results' es un arreglo
    if (!Array.isArray(results)) {
        return (
            <div className="SearchResults">
                <p>Los resultados no son válidos.</p>
            </div>
        );
    }

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.id]) acc[result.id] = [];
        acc[result.id].push(result);
        return acc;
    }, {});

    return (
        <div className="SearchResults">
            <div className="file-list">
                {Object.keys(groupedResults).map((id, index) => (
                    <div
                        key={index}
                        className={`file-item ${selectedId === id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(id)}
                    >
                        <div className="file-content">
                            {groupedResults[id].map((result, idx) => (
                                <div className="result" key={idx}>
                                    <p><strong>ID:</strong> {result.id}</p>
                                    <p><strong>Score:</strong> {result.score}</p>
                                    <p><strong>Sentence:</strong> {result.sentence}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
