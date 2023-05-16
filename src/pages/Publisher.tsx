import { useState, useEffect, useContext } from 'react';


//Components
import { PublisherType, searchLostGames } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';




export const Publisher = () => {

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    const [searchOption, setSearchOption] = useState("")
    const [searchText, setSearchText] = useState("")
    const [page, setPage] = useState(1)
    const [publisherlist, setPublisherList] = useState<PublisherType[]>([])
    const [getData] = searchLostGames('publisher', searchOption, searchText, "", page);





    useEffect(() => {

        if (getData){
            setPublisherList(getData as PublisherType[])  
        }

    }, [getData]);

    console.log(publisherlist);
    console.log(searchOption);
    console.log(searchText);
    console.log(fetchError)
    

    return (
        <div>

            <div className="card w-full bg-base-100 shadow-xl">
                <h5 className="card-title">
                    Publishers
                </h5>
                <br />
                <form className="flex flex-col gap-4">
                    <div>
                        <select className="select select-primary w-full" id="searchoption" name='searchoption' required={true} onChange={(e) => setSearchOption(e.target.value)}>
                            <option value={""}>Choose search criteria</option>
                            <optgroup label="Criteria">
                                <option value="id_publisher">Publisher Id</option>
                                <option value="name">Name</option>
                                <option value="country">Country</option>
                                <option value="year">Year</option>
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
                <th>Publisher ID</th>
                <th>Box Art</th>
                <th>Name</th>
                <th>Country</th>
                <th>Year</th>
                <th>State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {publisherlist.map((publisher) =>
                <tr key={publisher.id_publisher}>
                  <td>{publisher.id_publisher}</td>
                  <td><img className="avatar mask mask-squircle w-12 h-12" alt="boxart" src={publisher.img_url}></img></td>
                  <td>{publisher.name}</td>
                  <td>{publisher.country}</td>
                  <td>{publisher.year}</td>
                  <td>{publisher.state}</td>
                  <td><Link className="btn btn-active btn-link" to={`/publisherUpdate/${publisher.id_publisher}`}
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
                            (publisherlist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button> 
                    </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="btn btn-outline btn-primary" href="/PublisherCreate">Create New</a>
          </div>
        </div>
      </div>
    </div>
  )
}