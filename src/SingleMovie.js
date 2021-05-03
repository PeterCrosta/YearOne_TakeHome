import {useState, useEffect} from 'react'
import axios from 'axios'
import secrets from './secrets'
import {ratings} from './Firebase'

function SingleMovie(props) {
    const {movie, setMovie} = props
    const [director, setDirector] = useState('')
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      const getCredits = async () => {
        const searchStr = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${secrets.apiKey}&append_to_response=credits`
        const {data} = await axios.get(searchStr)
        const director = data.crew.find(el => el.job === 'Director')
        setDirector(director.name)
      }
      getCredits()
    }, [movie])
  
    useEffect(() => {
      const getRatings = () => {
        const movieDoc = ratings.doc(`${movie.id}`)
        movieDoc.get().then(doc => {
          if (doc.exists) {
            setLikes(doc.data().likes)
            setDislikes(doc.data().dislikes)
            setLoaded(true)
          } else {
            ratings.doc(`${movie.id}`)
            .set({
              likes: 0,
              dislikes: 0
            })
            .then(() => {
              console.log('new movie created')
              setLoaded(true)
            })
          }
        }).catch(error => {
          console.log('error: ', error)
        })
      }
      getRatings()
    }, [movie.id])

    useEffect(() => {
      const updateRatings = () => {
        const movieDoc = ratings.doc(`${movie.id}`)
        movieDoc.update({
          likes: likes,
          dislikes: dislikes
        })
      }
      if (loaded) updateRatings()
    }, [likes, dislikes, movie.id, loaded])
  
  
    return (
      <div>
          <div id="singleMovieContainer" >
            <button type="button" onClick={() => setMovie(null)}>X</button>
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
          <div className="ratingsContainer" >
            <div className="likesContainer">
              <button type="button" onClick={() => setLikes(likes-1)}>-</button>
              <span>likes: {likes}</span>
              <button type="button" onClick={() => setLikes(likes+1)}>+</button>
            </div>
            <div className="dislikesContainer" >
              <button type="button" onClick={() => setDislikes(dislikes-1)}>-</button>
              <span>dislikes: {dislikes}</span>
              <button type="button" onClick={() => setDislikes(dislikes+1)}>+</button>
            </div>
          </div>
          <p className="singleMovieOverview" >{movie.overview}</p>
        </div>
    </div>
  )
}

export default SingleMovie