import React, { useState } from 'react';
import './SearchResults.scss';

function SearchResults({ results }) {
    const [selectedFilename, setSelectedFilename] = useState(null);

    // Group results by filename
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.filename]) acc[result.filename] = [];
        acc[result.filename].push(result);
        return acc;
    }, {});

    const data = {
        name: "root",
        children: Object.keys(groupedResults).map(filename => ({
          name: filename,
          children: groupedResults[filename].map(result => ({
            name: result.sentence
          }))
        }))
      };

    return (
        <div className="SearchResults">
            <div className="file-list">
                {Object.keys(groupedResults).map((filename, index) => (
                    <div 
                        key={index} 
                        className={`file-name ${selectedFilename === filename ? 'selected' : ''}`}
                        onClick={() => setSelectedFilename(filename)}
                    >
                        {filename}
                        <div className="sentence-previews">
                            {groupedResults[filename].map((result, idx) => (
                                <span key={idx}>[...] {result.sentence} </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedFilename && (
                <div className="file-details">
                    {groupedResults[selectedFilename].sort((a, b) => a.id - b.id).map((result, index) => (
                        <div className="result" key={index}>
                            <p><strong>ID:</strong> {result.id}</p>
                            <p><strong>Score:</strong> {result.score}</p>
                            <p><strong>Sentence:</strong> {result.sentence}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
}

export default SearchResults;
