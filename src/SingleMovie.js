import {useState, useEffect} from 'react'
import axios from 'axios'
import secrets from './secrets'
import {ratings} from './Firebase' // Connects to our Firestore collection

function SingleMovie(props) {
    const {movie, setMovie} = props
    const [director, setDirector] = useState('')
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [loaded, setLoaded] = useState(false) // Prevents attempting to update DOM or database until initial async calls are complete


    useEffect(() => {
      const getCredits = async () => { // Only makes search for director in single view
        const searchStr = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${secrets.apiKey}&append_to_response=credits`
        try {
          const {data} = await axios.get(searchStr)
          const director = data.crew.find(el => el.job === 'Director')
          if (director) setDirector(director.name)
        } catch (error) {
          console.log('Error: ', error)
        }
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
          console.log('Error: ', error)
        })
      }
      getRatings()
    }, [movie.id])

    useEffect(() => {
      const movieDoc = ratings.doc(`${movie.id}`)
      const updateRatings = () => {
        movieDoc.update({
          likes: likes,
          dislikes: dislikes
        }).catch(error => {
          console.log('Error: ', error)
        })
      }
      if (loaded) updateRatings()
    }, [likes, dislikes, movie.id, loaded])
  
  
    return (
      <div>
          <div id="singleMovieContainer" >
            <button 
              type="button" 
              onClick={() => setMovie(null)}
              className="exitSingleMovieButton"
              >X</button>
            <img 
              className="singleMoviePoster" 
              src={movie.poster ? 
                `https://image.tmdb.org/t/p/original/${movie.poster}` : 
                "https://image.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg"} 
              alt="movie poster"
            />   
            <div id="singleMovieContentContainer" >
              <h1 className="singleMovieTitle">{movie.title}</h1>
              <h3>{director.length ? `Directed by ${director}` : "Director not listed"}</h3>
              <p 
                className="singleMovieReleaseYear" >
                {movie.releaseDate ? 
                  `Released ${movie.releaseDate}` : 
                  'Release date unknown'}
              </p>
              <div className="ratingsContainer" >
                <div className="feedbackContainer">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (likes > 0) setLikes(likes-1)
                    }}
                    disabled={!loaded}
                    className="ratingsButton"
                  >-</button>
                  <span className="ratingsSpan">👍 {likes}</span>
                  <button 
                    type="button" 
                    onClick={() => setLikes(likes+1)}
                    disabled={!loaded}
                    className="ratingsButton"
                  >+</button>
                </div>
                <div className="feedbackContainer" >
                  <button 
                    type="button" 
                    onClick={() => {
                      if (dislikes > 0) setDislikes(dislikes-1)
                    }}
                    disabled={!loaded}
                    className="ratingsButton"
                  >-</button>
                  <span className="ratingsSpan">👎 {dislikes}</span>
                  <button 
                    type="button" 
                    onClick={() => setDislikes(dislikes+1)}
                    disabled={!loaded}
                    className="ratingsButton"
                  >+</button>
                </div>
              </div>
              <p className="singleMovieOverview" >{movie.overview}</p>
              </div>  
        </div>
    </div>
  )
}

export default SingleMovie