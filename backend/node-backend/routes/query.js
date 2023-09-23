const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const express = require('express');
const axios = require('axios');
const router = express.Router();


//router to get the embeddins of a text

router.post('/embeddings', async (req, res) => {
    const { text } = req.body;
    try {
        // Call inference service
        const inferenceResponse = await axios.post('http://inference-service:8000/embeddings/', { text: text });

        // console log the response for debugging
        const inferenceData = inferenceResponse.data;
        console.log(inferenceData);
                
        // return the response
        res.json(inferenceData);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

router.post('/query', async (req, res) => {
    try {
        const collectionName = "python_docV2";


        const { text } = req.body;
        // Call inference service
        const inferenceResponse = await axios.post('http://inference-service:8000/embeddings/', { text: text });


        // console log the response for debugging
        const inferenceData = inferenceResponse.data;

        //extract the embedding from the response and call it searchVector
        const searchVector = inferenceData.embedding;

        const milvusClient = new MilvusClient("milvus-standalone:19530");
        await milvusClient.loadCollectionSync({
            collection_name: collectionName,
          });  
    
        const result = await milvusClient.search({
            collection_name: collectionName, // required, the collection name
            vector: searchVector, // required, vector used to compare other vectors in milvus
            params: { nprobe: 64 }, // optional, specify the search parameters
            limit: 10, // optional, specify the number of nearest neighbors to return
            metric_type: 'L2', // optional, metric to calculate similarity of two vectors
            output_fields: ['filename', 'sentence', 'id'] 
          });

        // get the actual ids of the documents
        //const retrieveResponse = await axios.post('http://document-retrieval-service:8001/retrieve', { ids: result.results.map((result) => result.id) });

        // get the actual ids of the documents
        //const retrieveResponse = await axios.post('http://document-retrieval-service:8001/retrieve', { ids: result });
          
        // Return the search results
        res.send(result.results)
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;