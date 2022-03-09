const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const headers = require('./corsHeader');

const todos = [];

const requestListener = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHeader(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            "title": title,
            "id": uuidv4(),
          }
          todos.push(todo);
          res.writeHeader(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();
        } else {
          errHandle(res);
        }
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHeader(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element => element.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHeader(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
    } else {
      errHandle(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () =>{
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          res.writeHeader(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();
        } else {
          errHandle(res);
        }
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHeader(200, headers);
    res.end();
  } else {
    res.writeHeader(404, headers);
    res.write(JSON.stringify({
      "status": "false",
      "message": "無此網路路由"
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);