import React, { useState } from 'react';
import Axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Header from './components/Header/Header'
import NotFound from './components/NotFound/NotFound';
import './App.scss';


function App() {
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const handleSearch = async (query) => {
        try {
            const response = await Axios.post(`http://localhost:90/api/query`, { text: query });
            setResults(response.data);
            console.log(response.data);
            setNoResults(false);
        } catch (error) {
            console.error("Error fetching search results", error);
            console.log('error')
            setNoResults(true);
        }
    };

    return (
        <div className="App">
            <Header/>
            <SearchBar onSearch={handleSearch} />
            <SearchResults results={results} />
            {noResults && <NotFound/>}
        </div>
    );
}

export default App;
