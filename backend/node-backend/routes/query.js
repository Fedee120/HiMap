const { MilvusClient } = require("@zilliz/milvus2-sdk-node");
const { Pool } = require('pg');
const express = require('express');
const axios = require('axios');
const router = express.Router();

// PostgreSQL connection pool
const pool = new Pool({
  host: 'postgres',
  port: '5432',
  user: 'postgres',
  password: 'yourpassword',
  database: 'wiki'
});

// Milvus client
const milvusClient = new MilvusClient("milvus-standalone:19530");

// Router to get the embeddings of a text
router.post('/embeddings', async (req, res) => {
  const { text } = req.body;
  try {
    const inferenceResponse = await axios.post('http://inference-service:8000/embeddings/', { text: text });
    const inferenceData = inferenceResponse.data;
    console.log(inferenceData);
    res.json(inferenceData);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

router.post('/query', async (req, res) => {
  try {
    const timings = {};  // Object to hold the timing measurements

    const collectionName = "wiki_v1";
    const { 
      text, 
      ef = 40,  // default value if not provided
      limit = 10,  // default value if not provided
      metric_type = 'L2'  // default value if not provided
    } = req.body;

    const inferenceStart = process.hrtime.bigint();
    const inferenceResponse = await axios.post('http://inference-service:8000/embeddings/', { text: text });
    timings.inference_time = Number(process.hrtime.bigint() - inferenceStart) / 1e6;  // Convert to milliseconds

    const searchVector = inferenceResponse.data.embedding;

    const vectorialSearchStart = process.hrtime.bigint();
    const result = await milvusClient.search({
      collection_name: collectionName,
      vector: searchVector,
      params: { "ef": ef },
      limit: limit,
      metric_type: metric_type,
      output_fields: ['id', 'vector']
    });
    timings.vectorial_search_time = Number(process.hrtime.bigint() - vectorialSearchStart) / 1e6;  // Convert to milliseconds

    const ids = result.results.map(item => item.id);

    const sqlSearchStart = process.hrtime.bigint();
    const queryText = 'SELECT id, summary FROM summaries WHERE id = ANY($1)';
    const dbResponse = await pool.query(queryText, [ids]);
    timings.sql_search_time = Number(process.hrtime.bigint() - sqlSearchStart) / 1e6;  // Convert to milliseconds

    const orderingStart = process.hrtime.bigint();

    const sentences = dbResponse.rows;
    const idToSentence = Object.fromEntries(sentences.map(row => [row.id, row.summary]));
    const combinedResults = result.results.map(item => ({
      id: item.id,
      score: item.score,
      sentence: idToSentence[item.id] || 'No sentence found for this id'
    }));
    timings.post_processing_time  = Number(process.hrtime.bigint() - orderingStart) / 1e6;  // Convert to milliseconds

    res.json({
      data: combinedResults,
      timings: timings  // Include the timings in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

router.post('/load-collection', async (req, res) => {
  try {
      // Get the collection name from the request body
      const { collectionName } = req.body;
      
      // Validate collection name
      if (!collectionName) {
          return res.status(400).json({ message: 'Collection name is required' });
      }

      // Create a new Milvus client
      const milvusClient = new MilvusClient("milvus-standalone:19530");
      
      // Load the specified collection into memory
      const startTime = Date.now();
      await milvusClient.loadCollectionSync({ collection_name: collectionName });
      const endTime = Date.now();
      
      // Calculate the time taken to load the collection
      const loadTime = endTime - startTime;
      
      // Send a success response
      res.json({ message: `Collection ${collectionName} loaded successfully`, loadTime });
  } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

module.exports = router;