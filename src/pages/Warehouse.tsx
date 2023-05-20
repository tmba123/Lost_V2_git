import { useState, useEffect, useContext } from 'react';


//Components
import { WarehouseType, searchLostGames } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';




export const Warehouse = () => {

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    const [searchOption, setSearchOption] = useState("")
    const [searchText, setSearchText] = useState("")
    const [page, setPage] = useState(1)
    const [warehouseslist, setWarehousesList] = useState<WarehouseType[]>([])
    const [getData] = searchLostGames('warehouse', searchOption, searchText, "", page);





    useEffect(() => {

        if (getData){
            setWarehousesList(getData as WarehouseType[]) 
            //Reset to page 1 if when filtered list results <= 4 
            if(warehouseslist.length <= 4){
              setPage(1)}
        }

    }, [getData]);

    console.log(warehouseslist);
    console.log(searchOption);
    console.log(searchText);
    console.log(fetchError)
    

    return (
        <div>

            <div className="card w-full bg-base-100 shadow-xl">
                <h5 className="card-title">
                    Warehouses
                </h5>
                <br />
                <form className="flex flex-col gap-4">
                    <div>
                        <select className="select select-primary w-full" id="searchoption" name='searchoption' required={true} onChange={(e) => setSearchOption(e.target.value)}>
                            <option value={""}>Choose search criteria</option>
                            <optgroup label="Criteria">
                                <option value="id_warehouse">Warehouse ID</option>
                                <option value="location">Location</option>
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
                <th>Warehouse ID</th>
                <th>Location</th>
                <th>State</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {warehouseslist.map((warehouse) =>
                <tr key={warehouse.id_warehouse}>
                  <td>{warehouse.id_warehouse}</td>
                  <td>{warehouse.location}</td>
                  <td>{warehouse.state}</td>
                  <td>{warehouse.id_warehouse != 1 ?
                   (<Link className="btn btn-active btn-link" to={`/WarehouseUpdate/${warehouse.id_warehouse}`}>
                    Edit</Link>) : null}
                  </td>  
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
                            (warehouseslist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button> 
                    </div>
          <div className="flex flex-wrap items-center gap-2">
            <a className="btn btn-outline btn-primary" href="/WarehouseCreate">Create New</a>
          </div>
        </div>
      </div>
    </div>
  )
}