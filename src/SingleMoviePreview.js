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

  export default SingleMoviePreview