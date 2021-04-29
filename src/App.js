import {useState, useEffect} from 'react'
import './App.css';
import logo from './logo.svg'
import axios from 'axios'
import secrets from './secrets'

function SingleMoviePreview(props) {
  const {id, title, poster, overview} = props.movie
  const {idx, setSingleMovie, movies} = props

  return (
    <div key={idx}>
      <img src={`https://image.tmdb.org/t/p/original/${poster}`} width='100' alt="movie poster" className="posterPreview" />
      <h3 
        className="titlePreview"
        onClick={() => setSingleMovie(movies[idx])}
      >{title}</h3>
      <p className="overviewPreview">{overview}</p>
    </div>
  )
}

function SingleMovie(props) {
  const {movie, setMovieId} = props
  const [director, setDirector] = useState('')
// https://api.themoviedb.org/3/movie/157336?api_key=16ff66b6a4fe255819100131f3826554&append_to_response=credits
  useEffect(() => {
    const getCredits = async () => {
      const searchStr = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${secrets.apiKey}&append_to_response=credits`
      const {data} = await axios.get(searchStr)
      console.log(data)
      const director = data.crew.find(el => el.job === 'Director')
      setDirector(director.name)
    }
    getCredits()
  }, [movie])


  return (
    <div>
        <div id="singleMovieContainer" >
          <button type="button" onClick={() => setMovieId(null)}>X</button>
          {movie.poster ? (
            <img 
              className="singleMoviePoster" 
              src={`https://image.tmdb.org/t/p/original/${movie.poster}`} 
              width="75"
              alt="movie poster"
            />

          ) : (
            <div>Icons made by <a href="https://www.flaticon.com/authors/flat-icons" title="Flat Icons">Flat Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
          )}
          <h1 className="singleMovieTitle">{movie.title}</h1>
          <h3>{director ? `Directed by ${director}` : "Director not listed"}</h3>
          <p className="singleMovieReleaseYear" >{movie.releaseDate ? `Released ${movie.releaseDate}` : 'Release date unknown'}</p>
          <p className="singleMovieOverview" >{movie.overview}</p>
        </div>
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [singleMovie, setSingleMovie] = useState(null)



  useEffect(() => {

    const handleChange = async () => {
  
      const searchStr = `https://api.themoviedb.org/3/search/movie?api_key=${secrets.apiKey}&language=en-US&query=${searchTerm}&include_adult=false`
  
      const {data} = await axios.get(searchStr)
      const res = data.results.reduce((accumulator, mov) => {
        if (mov.original_language === 'en') {
          accumulator.push({
            id: mov.id,
            title: mov.title,
            poster: mov.poster_path,
            overview: mov.overview,
            popularity: mov.popularity
        })
      }
        return accumulator
      }, [])
      res.sort((a,b) => b.popularity - a.popularity)
      setMovies(res)
    }
    if (searchTerm.length) handleChange()
    else setMovies([])
  }, [searchTerm])


  return (
    <div className="App">
      <table className="titleBar">
        <tbody>
          <tr>
            <td>
              <img width="50" src={logo} alt="atom"/>
            </td>
            <td>
              <h3 style={{
                color: "#fff"
              }}
              >Movie DB Search
              </h3>
            </td>
          </tr>
        </tbody>
      </table>
      <form 
        className="searchBar"
      >
        <input 
          type="text"
          className="searchBar" 
          placeholder="Enter movie name" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          />
      </form>
      {singleMovie ? (
        < SingleMovie 
          movie={singleMovie}
          setMovie={setSingleMovie}
        />
        ) : (
        movies.map((movie, idx) => (
        <SingleMoviePreview
          movie={movie}
          idx={idx}
          setSingleMovie={setSingleMovie}
          movies={movies}
       />)))}
    </div>
  );
}

export default App;
