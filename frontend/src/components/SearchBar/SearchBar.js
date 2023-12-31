import React, { useState } from 'react';
import './SearchBar.scss';


function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="SearchBar">
            <form className="SearchBar" onSubmit={handleSubmit}>
                <input 
                    className='search-input'
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your search query..." 
                />
                <button type="submit" className='search-button'>Search</button>
            </form>
        </div>
    );    
}

export default SearchBar;