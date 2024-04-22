require('../models')
const request = require('supertest');
const app = require('../app');

const URL_BASE = '/api/v1/directors'

const director = {
    firstName: 'Andrew',
    lastName: 'Smith',
    nationality: 'USA',
    image: 'RamdomImage',
    birthday: '1978-11-12'
}

let directorId;

test("POST 'URL_BASE', should return status code 201 and res.body.name === director.name", async() =>{
    const res = await request(app)
        .post(URL_BASE)
        .send(director)

        directorId = res.body.id;

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(director.name)
})

test("GET 'URL_BASE', should return status code 200 and res.body.length === 1", async () =>{
    const res = await request(app)
        .get(URL_BASE)
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

})

test("GET 'URL_BASE/:id', should return status code 200 and res.body.name === director.name", async () =>{
    const res = await request(app)
        .get(`${URL_BASE}/${directorId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(director.name)
})

test("PUT 'URL_BASE/id', should return status code 200 and res.body.name === bodyUpdate.name", async () =>{
    const bodyUpdate = {
        firstName: 'Julius'
    }

    const res = await request(app)
        .put(`${URL_BASE}/${directorId}`)
        .send(bodyUpdate)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(bodyUpdate.firstName)

})

test("DELETE 'URL_BASE/:id', should return status code 204", async () =>{
    const res = await request(app)
        .delete(`${URL_BASE}/${directorId}`)

    expect(res.status).toBe(204)
})