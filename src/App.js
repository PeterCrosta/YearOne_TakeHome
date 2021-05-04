import {useState, useEffect} from 'react'
import './App.css';
import axios from 'axios'
import secrets from './secrets'
import SingleMoviePreview from './SingleMoviePreview'
import SingleMovie from './SingleMovie'
import film from './film.png'


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
      <div id='titleBar'>
        <div id='titleBarContents'>
          <div id='titleLogo'>
            <img width="50" src={film} alt="atom"/>
            <h3 id="titleText">Movie DB Search</h3>

          </div>
        <a 
          href="https://github.com/PeterCrosta/YearOne_TakeHome" 
          target='_blank' 
          rel='noopener noreferrer'
        >
          <img 
            src='https://www.sferalabs.cc/wp-content/uploads/github-logo-white.png' 
            alt='github logo' 
            className="githubIcon"
            />
        </a>
        </div>
      </div>
      <form 
        className="searchBar"
      >
        <input 
          type="text"
          className="searchBarInput" 
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
