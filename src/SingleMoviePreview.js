function SingleMoviePreview(props) {
    const {title, poster, overview} = props.movie
    const {idx, setSingleMovie, movies} = props
    return (
      <div 
        key={idx} 
        className="singleMoviePreviewContainer" 
        onClick={() => setSingleMovie(movies[idx])} // Loads the SingleMovie component
      >
        <img 
          src={poster ? `https://image.tmdb.org/t/p/original/${poster}` : "https://image.shutterstock.com/image-vector/no-image-available-vector-illustration-260nw-744886198.jpg"} 
          width='100' 
          alt="movie poster" 
          className="posterPreview" 
        />
        <div className="titleAboutConatiner" >
          <h3 
            className="titlePreview"
          >{title}</h3>
          <p className="overviewPreview">{overview}</p>
        </div>
      </div>
    )
  }

  export default SingleMoviePreview