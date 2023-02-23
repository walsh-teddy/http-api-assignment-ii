// Framework coppied from my first html api homework

const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const jsonResponse = JSON.stringify(object);

  response.writeHead(status, headers);
  response.write(jsonResponse);
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  respondJSON(request, response, 200, users);
};

const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const addUsers = (request, response, body) => {
  // Create an empty response object
  // Check if the name and age are not empty
  if (body.name && body.age) { // They exist
    // Check if the name is already in the system
    if (users[body.name]) { // The user already exists
      // Update the age
      users[body.name].age = body.age;
      const responseJSON = { message: 'Created Successfully' };
      respondJSON(request, response, 204, responseJSON);
    } else { // Its a new user
      // Add the new user (don't return a message)
      users[body.name] = { age: body.age };
      respondJSONMeta(request, response, 201);
    }
  } else { // They don't exist
    // Send back an error message
    const responseJSON = { message: 'Name and age are both required', id: 'addUserMissingParams' };
    respondJSON(request, response, 404, responseJSON);
  }
};

const notFound = (request, response) => {
  const body = {
    message: 'Page not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, body);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUsers,
};
