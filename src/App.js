import {useState, useEffect} from 'react'
import './App.css';
import logo from './logo.svg'
import axios from 'axios'
import secrets from './secrets'
import SingleMoviePreview from './SingleMoviePreview'
import SingleMovie from './SingleMovie'


function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [singleMovie, setSingleMovie] = useState(null)



  useEffect(() => {
    const handleChange = async () => {
      setSingleMovie(null)
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
