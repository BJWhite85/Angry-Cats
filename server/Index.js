const express = require('express');
const app = express();
const port = 3300;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening at localhost:${port}!`);
});