const express = require('express');
const queryRoute = require('./routes/query');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Middleware to enable CORS

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', queryRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
