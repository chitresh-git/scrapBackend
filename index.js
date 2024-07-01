


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
    const response = await axios.get(url); // fetching html content using provided url 
    const htmlContent = response.data;
    

    const dom = new JSDOM(htmlContent);   // jsdom will parse the html and creates DOM like environment 
    const document = dom.window.document;

    const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href);
    // fetching all the css links 
    // queryselector will select all the elements with rel='stylesheel'
    // now .map() method will take link attribute and return its link.href i.e. Url of css file 

    const cssPromises = cssLinks.map(cssUrl => axios.get(cssUrl).then(res => res.data).catch(err => ''));
    // fetching data from csslinks 
    // axios.get() send the http request to cssurl
    // after that  .then() return data of reponse

    const cssContents = await Promise.all(cssPromises);
    // this will wait until complete css data get sotred in csscontent

    res.send({ htmlContent, cssContents: cssContents.filter(Boolean) }); // sending html and its css back to client 
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
