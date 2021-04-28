import {useState, useEffect} from 'react'
import './App.css';
import logo from './logo.svg'
import axios from 'axios'
import secrets from './secrets'

function SingleMoviePreview(props) {
  const {id, title, poster, overview} = props.movie
  const {idx} = props

  return (
    <div key={idx}>
      <img src={`https://image.tmdb.org/t/p/original/${poster}`} width='100' alt="movie poster" className="posterPreview" />
      <h3 className="titlePreview">{title}</h3>
      <p className="overviewPreview">{overview}</p>
    </div>
  )
}

function SingleMovie(props) {
  const {movieId} = props
}

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [singleMovId, setSingleMovId] = useState(null)



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
        // onChange={handleChange} 
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
      {movies.map((movie, idx) => (<SingleMoviePreview
      movie={movie}
      idx={idx}
       />))}
    </div>
  );
}

export default App;
