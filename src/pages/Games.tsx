import { useState, useEffect, useContext } from 'react';


//Components
import { PublisherType, GameType, searchLostGames } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';




export const Games = () => {

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    const [searchOption, setSearchOption] = useState("")
    const [searchText, setSearchText] = useState("")
    const [page, setPage] = useState(1)
    const [gameslist, setGamesList] = useState<GameType[]>([])
    const [getData] = searchLostGames('game', searchOption, searchText, "", page);





    useEffect(() => {

        if (getData){
            setGamesList(getData as GameType[])
            //Reset to page 1 if when filtered list results <= 4 
            if(gameslist.length <= 4){
                setPage(1)}  
        }

    }, [getData]);

    console.log(gameslist);
    console.log(searchOption);
    console.log(searchText);
    console.log(fetchError)
    

    return (
        <div>

            <div className="card w-full bg-base-100 shadow-xl">
                <h5 className="card-title">
                    Games
                </h5>
                <br />
                <form className="flex flex-col gap-4">
                    <div>
                        <select className="select select-primary w-full" id="searchoption" name='searchoption' required={true} onChange={(e) => setSearchOption(e.target.value)}>
                            <option value={""}>Choose search criteria</option>
                            <optgroup label="Criteria">
                                <option value="id_game">Game Id</option>
                                <option value="id_publisher">Publisher Id</option>
                                <option value="publisher.name">Publisher Name</option>
                                <option value="name">Name</option>
                                <option value="genre">Genre</option>
                                <option value="platform">Platform</option>
                                <option value="release_year">Year</option>
                                <option value="state">State</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <input className="input input-bordered input-secondary w-full"
                            id="searchtext"
                            name='searchtext'
                            type="text"
                            placeholder="option value"
                            required={true}
                            onChange={(e) => {
                                (e.target.value.length > 0 && searchOption=="") ? setFetchError("Choose search criteria"):setSearchText(e.target.value);
                              }}/>
                    </div>
                </form>
                <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} fetchSuccess={fetchSuccess} setFetchSuccess={setFetchSuccess} />
                <br />
                <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Game ID</th>
                <th>Publisher ID</th>
                <th>Publisher Name</th>
                <th>Box Art</th>
                <th>Name</th>
                <th>Genre</th>
                <th>Platform</th>
                <th>Release Year</th>
                <th>State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gameslist.map((game) =>
                <tr key={game.id_game}>
                  <td>{game.id_game}</td> 
                  <td>{game.id_publisher}</td>
                  <td>{game.publisher?.name}</td>
                  <td><img className="w-14 h-14 object-contain max-w-full object-center" alt="boxart" src={game.img_url}></img></td>
                  <td>{game.name}</td>
                  <td>{game.genre}</td>
                  <td>{game.platform}</td>
                  <td>{game.release_year}</td>
                  <td>{game.state}</td>
                  <td><Link className="btn btn-active btn-link" to={`/publisherUpdate/${game.id_game}`}
                  >Edit</Link></td>
                </tr>
              )}
            </tbody>
          </table>
          <br />
          <div className="btn-group">
                        <button className="btn btn-outline" onClick={() => setPage(Math.max(page - 1, 1))}>«</button>
                        <button className="btn btn-outline">{page}</button>
                        <button className="btn btn-outline" onClick={() => 
                            //Reset to page 1 if it's the last page avoid error "Requested range not satisfiable from supabase"
                            (gameslist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button> 
                    </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="btn btn-outline btn-primary" href="/GameCreate">Create New</a>
          </div>
        </div>
      </div>
    </div>
  )
}
