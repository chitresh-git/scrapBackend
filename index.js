// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// app.use(cors());

// app.get('/fetch-website', async (req, res) => {
//   const { url } = req.query;

//   try {
//     const response = await axios.get(url);
//     res.send(response.data);
//   } catch (error) {
//     console.error('Error fetching website:', error);
//     res.status(500).send('Failed to fetch content.');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/fetch-website', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href);

    const cssPromises = cssLinks.map(cssUrl => axios.get(cssUrl).then(res => res.data).catch(err => ''));
    const cssContents = await Promise.all(cssPromises);

    res.send({ htmlContent, cssContents: cssContents.filter(Boolean) });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).send('Failed to fetch content.');
  }
});

app.get('/', async (req, res) => {
 res.send("server is running ")
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
