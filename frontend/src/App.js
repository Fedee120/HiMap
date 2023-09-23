import React, { useState } from 'react';
import Axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import './App.scss';


function App() {
    const [results, setResults] = useState([]);


    const handleSearch = async (query) => {
        try {
            const response = await Axios.post(`http://localhost:80/api/query`, { text: query });
            setResults(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching search results", error);
        }
    };

    return (
        <div className="App">
            <SearchBar onSearch={handleSearch} />
            <SearchResults results={results} />
        </div>
    );
}

export default App;
