const request = require('supertest');
const app = require('../app');
const Actor = require('../models/Actor');
const Director = require('../models/Director');
const Genre = require('../models/Genre');

require('../models');

const URL_BASE = '/api/v1/movies';
const movie = {
    name: 'Titanic',
    image: 'RamdomTitanic.jpg',
    synopsis: 'loremlroemsdlfjslfel4e',
    releaseYear: 1998
}

let movieId;

test("POST 'URL_BASE', should return 201 and res.body.name === movie.name", async () =>{
    const res = await request(app)
        .post(URL_BASE)
        .send(movie)

        movieId = res.body.id;

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})

test("GET 'URL_BASE', should return status code 200 and res.body.length === 1", async () =>{
    const res = await request(app)
        .get(URL_BASE)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET 'URL_BASE/:id', should return status code 200 and res.body.name === movie.name", async () =>{
    const res = await request(app)
        .get(`${URL_BASE}/${movieId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})

test("PUT 'URL_BASE/:id', should return status code 200 and res.body.name === updatyBody.name", async () =>{
    const bodyUpdate = {
        name: 'Rambo 1'
    }

    const res = await request(app)
        .put(`${URL_BASE}/${movieId}`)
        .send(bodyUpdate)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(bodyUpdate.name)
})

test("POST 'URL_BASE/:id/actors' should return status code 200 and res.body.length === 1", async () =>{
    const actor = {
        firstName: 'Jons',
        lastName: 'Stons',
        nationality: 'UK',
        image: 'JONS.PNG',
        birthday: '1995-01-12'
    }

    const createActor = await Actor.create(actor);

    const res = await request(app)
        .post(`${URL_BASE}/${movieId}/actors`)
        .send([createActor.id])
        //console.log(res.body);

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesActors.actorId).toBe(createActor.id)
    expect(res.body[0].moviesActors.movieId).toBe(movieId)
    
    await createActor.destroy();
})

test("POST 'URL_BASE/:id/directors', should return status code 200 and res.body.length === 1", async () =>{
    const createDirector = await Director.create({
        firstName: 'Julian',
        lastName: 'Alvarez',
        nationality: 'Argentino',
        image: 'JUlian.png',
        birthday: '2000-11-12'
    })

    const res = await request(app)
        .post(`${URL_BASE}/${movieId}/directors`)
        .send([createDirector.id])
        //console.log(res.body);
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesDirectors.directorId).toBe(createDirector.id)
    expect(res.body[0].moviesDirectors.movieId).toBe(movieId)

    await createDirector.destroy();

})

test("POST 'URL_BASE/:id/genres', should return status code 200 and res.body.length === 1", async () =>{
    const createGenre = await Genre.create({
        name: 'Pop'
    })

    const res = await request(app)
        .post(`${URL_BASE}/${movieId}/genres`)
        .send([createGenre.id])
        //console.log(res.body);

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesGenres.movieId).toBe(movieId)
    expect(res.body[0].moviesGenres.genreId).toBe(createGenre.id)

    await createGenre.destroy();
})

test("DELETE 'URL_BASE/:id', should return status code 204", async () =>{
    const res = await request(app)
        .delete(`${URL_BASE}/${movieId}`)

    expect(res.status).toBe(204)
})