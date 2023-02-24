// Basic framework coppied from my first HTTP API Assignment
// Set up directories
// Adding this line here so that I can commit a change and circleCl will actually give me my link
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Tests if there is any port other than 3000 it should be using
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, callback) => {
  // Create an empty body
  const body = [];

  // Set up error handling
  request.on('error', () => {
    // Note the error and send back the response
    response.statusCode = 400;
    response.end();
  });

  // Set up the data handling
  request.on('data', (chunk) => {
    // Push it to the array
    body.push(chunk);
  });

  // Set up the end handling
  request.on('end', () => {
    // put all the data together into 1 object and turn it into a string
    const bodyString = Buffer.concat(body).toString();
    // Turn that string into an object
    const bodyObj = query.parse(bodyString);

    // Do the callback function with the new body object
    callback(request, response, bodyObj);
  });
};

// Urls with each method it should use
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS, // Alows the page to actually use the css (it wasn't before)
    '/getUsers': jsonHandler.getUsers,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUsers,
  },
};

// Called every time the server recieves a request from the client
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url).pathname;
  const { method } = request;

  // Check if the user entered either POST, GET, or HEAD
  if (method === 'POST') {
    // There is only 1 possible url with POST
    parseBody(request, response, urlStruct[method][parsedUrl]);
  } else if (urlStruct[method]) { // It is using GET or HEAD
    // Check if its URL is found
    if (urlStruct[method][parsedUrl]) { // It is found
      urlStruct[method][parsedUrl](request, response);
    } else { // It is not found
      urlStruct[method].notFound(request, response);
    }
  } else { // It is not using GET or HEAD or the right url with POST
    // Default to GET.notFound
    urlStruct.GET.notFound(request, response);
  }
};

// Create the server
http.createServer(onRequest).listen(port, () => {});
