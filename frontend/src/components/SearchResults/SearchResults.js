import React from 'react';
import './SearchResults.scss';

function SearchResults({ results }) {
    if (!results.length) return <p>No results found.</p>;
    return (
        <div className="SearchResults">
            {results.map((sentence, index) => (
                <div className="result" key={index}>
                    {sentence}
                </div>
            ))}
        </div>
    );    
}


export default SearchResults;
