import {useState, useEffect} from 'react'
import './App.css';
import logo from './logo.svg'
import axios from 'axios'
import secrets from './secrets'

function SingleMoviePreview(props) {
  const {id, title, poster, overview} = props.movie
  const {idx, setSingleMovieId} = props

  return (
    <div key={idx}>
      <img src={`https://image.tmdb.org/t/p/original/${poster}`} width='100' alt="movie poster" className="posterPreview" />
      <h3 
        className="titlePreview"
        onClick={() => setSingleMovieId(id)}
      >{title}</h3>
      <p className="overviewPreview">{overview}</p>
    </div>
  )
}

function SingleMovie(props) {
  const {movieId} = props
  const [movieInfo, setMovieInfo] = useState({})
// https://api.themoviedb.org/3/movie/157336?api_key=16ff66b6a4fe255819100131f3826554&append_to_response=credits
  useEffect(() => {
    const getMovieInfo = async () => {
      const searchStr = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${secrets.apiKey}&append_to_response=credits`
      const {data} = await axios.get(searchStr)
      console.log(data)
      const {title, overview, release_date, poster_path} = data
      const director = data.credits.crew.find(el => el.job === 'Director')
      setMovieInfo({
        id: movieId,
        title,
        overview,
        releaseDate: release_date,
        poster: poster_path,
        director: director.name
      })
    }
    getMovieInfo()
  })


  return (
    <div>
      {movieInfo.title ? (
        <div id="singleMovieContainer" >
          <h1 className="singleMovieTitle">{movieInfo.title}</h1>
          <h3>{movieInfo.director}</h3>
        </div>
  
      ) : (
        <h2>Loading...</h2>
      )}

    </div>
  )
}

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [singleMovieId, setSingleMovieId] = useState(null)



  useEffect(() => {

    const handleChange = async () => {
  
      const searchStr = `https://api.themoviedb.org/3/search/movie?api_key=${secrets.apiKey}&language=en-US&query=${searchTerm}&page=${page}&include_adult=false`
  
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
  }, [searchTerm, page])


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
      {singleMovieId ? (
        < SingleMovie 
          movieId={singleMovieId}
        />
        ) : (
        movies.map((movie, idx) => (
        <SingleMoviePreview
          movie={movie}
          idx={idx}
          setSingleMovieId={setSingleMovieId}
       />)))}
    </div>
  );
}

export default App;
