const express = require('express');
const queryRoute = require('./routes/query');

const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', queryRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
