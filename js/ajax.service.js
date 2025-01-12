'use strict'

const API_KEY = 'fe19901af0d49d08665fe9bf0fd93f4d'
const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`

const genres_key = 'genres'
const movies_key = 'movies'

function getGenre(onSuccess){
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    getData(url, onSuccess)
}

function getData(url, cb) {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const ans = JSON.parse(xhr.responseText)
            cb(ans)
        }
    }

    xhr.open('GET', url, true)
    xhr.send()
}

function getGenres(onSuccess) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    getData(url, response => {
        if (response && Array.isArray(response.genres)) {
            onSuccess(response.genres)
        } else {
            console.error('Invalid response from getGenres:', response)
        }
    })
}

function getMoviesByGenre(genre, onSuccess) {
    let movies = loadFromStorage(movies_key) || {}
    if (movies[genre.name]) return onSuccess(movies[genre.name])

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`
    getData(url, res => {
        const moviesData = prepareData(res)

        movies[genre.name] = moviesData
        saveToStorage(movies_key, movies)
        
        onSuccess(moviesData)
    })
}

function prepareData({ results }) {
    console.log('API results:', results)
    return results.map(({ title, overview, backdrop_path }) => {
        if (!backdrop_path) console.warn(`No image for movie: ${title}`)
        return { title, overview, backdrop_path }
    })
}

function getGenreById(id) {
    const genres = loadFromStorage(genres_key)
    return genres.find(g => g.id === id)
}