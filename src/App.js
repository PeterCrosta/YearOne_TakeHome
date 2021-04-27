import {useState} from 'react'
import './App.css';
import logo from './logo.svg'

function App() {
  const [movies, setMovie] = useState([{id: 0, title: "Harry and the Hendersons", overview: "A movie I haven't seen"}])
  const rows = []
  movies.forEach(movie => {
    rows.push(<div key={movie.id}>
      <img src="" alt="poster"/>
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
    </div>)
  })
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

      <input className="searchBar" placeholder="Enter movie name" />
      {rows}
    </div>
  );
}

export default App;
