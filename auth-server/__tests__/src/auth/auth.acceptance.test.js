'use strict';

require('dotenv').config();
const superagent = require('superagent');
const mongoose = require('mongoose');
const app = require('../../../src/app.js');
describe('Authentication Server', () => {
  var server;
  const PORT = 8888;
  server = app.start(PORT);
  beforeAll(() => {
    mongoose.connect(process.env.MONGODB_URI);
  });
  afterAll(() => {
    mongoose.connection.db.dropCollection('users');
    mongoose.connection.close();
    server.close();
  });

  it('should create one on signup', () => {
    return superagent.post('http://localhost:8888/api/signup')
      .send({ username: 'tama', password: 'foo', email: 'foo@bar.com' })
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toBeDefined;
      })
      .catch(err => expect(err).toEqual('nothing here'));
  });
  it('gets a 401 on a bad login', () => {
    return superagent.get('http://localhost:8888/api/signin')
      .then(response => {
        expect(response).toEqual('nothing here');
      })
      .catch(response => {
        expect(response.status).toEqual(401);
      });
  });

  it('gets a 401 on a bad login', () => {
    return superagent.get('http://localhost:8888/api/signin')
      .auth('foo', 'bar')
      .then(response => {
        expect(response).toEqual('nothing here');
      })
      .catch(response => {
        expect(response.status).toEqual(401);
      });
  });

  it('gets a 200 on a good login', () => {
    return superagent.get('http://localhost:8888/api/signin')
      .set({ 'Authorization': `Basic bWFkaHU6Zm9v` })
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Welcome');
      })
      .catch(console.err);
  });
  it('should throw 400 error if no request body found for user signup request', () => {
    return superagent.post('http://localhost:8888/api/signup')
      .then(response => {
        expect(response.statusCode).toEqual(200);
      })
      .catch(err => {
        expect(err.status).toEqual(400);
        expect(err.toString()).toEqual('Error: Bad Request');
      });
  });
  it('should throw 400 error if duplicate username is posted', () => {
    return superagent.post('http://localhost:8888/api/signup')
      .send({ username: 'tama', password: 'foo', email: 'foo@bar.com' })
      .catch(err => {
        expect(err.status).toEqual(400);
        expect(err.toString()).toEqual('Error: Bad Request');
      });
  });
  it('should throw 404 if route not found', () => {
    return superagent.post('http://localhost:8888/signup')
      .send({ username: 'tama', password: 'foo', email: 'foo@bar.com' })
      .catch(err => {
        expect(err.status).toEqual(404);
        expect(err.toString()).toEqual('Error: Not Found');
      });
  });

});


  
