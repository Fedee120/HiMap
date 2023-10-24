import React, { useState } from 'react';
import Axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import './App.scss';

function App() {
    const [results, setResults] = useState([]);
    const [statistics, setStatistics] = useState(null);

    const handleSearch = async (query) => {
        try {
            const response = await Axios.post(`http://localhost:80/api/query`, { text: query });
            setResults(response.data.data);
            setStatistics(response.data.timings);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching search results", error);
        }
    };

    return (
        <div className="App">
            <SearchBar onSearch={handleSearch} />

            <div className="statistics-container">
                {statistics && (
                    <div className="statistics-item">
                        <p className="statistics-label">Inference Time</p>
                        <p className="statistics-value">{statistics.inference_time.toFixed(2)} ms</p>
                    </div>
                )}
                {statistics && (
                    <div className="statistics-item">
                        <p className="statistics-label">Vectorial Search Time</p>
                        <p className="statistics-value">{statistics.vectorial_search_time.toFixed(2)} ms</p>
                    </div>
                )}
                {statistics && (
                    <div className="statistics-item">
                        <p className="statistics-label">SQL Search Time</p>
                        <p className="statistics-value">{statistics.sql_search_time.toFixed(2)} ms</p>
                    </div>
                )}
                {statistics && (
                    <div className="statistics-item">
                        <p className="statistics-label">Post-processing Time</p>
                        <p className="statistics-value">{statistics.post_processing_time.toFixed(2)} ms</p>
                    </div>
                )}
            </div>

            <SearchResults results={results} />
        </div>
    );
}

export default App;
