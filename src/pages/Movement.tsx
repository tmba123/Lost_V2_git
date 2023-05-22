import { useState, useEffect, useContext } from 'react';


//Components
import { MovementType } from "../context/LostGamesContext";
import { searchMovements } from "../context/MovementSearch";
import { ErrorAlert } from '../components/Alerts';
import { AppContext } from '../context/AppContext';




export const Movement = () => {

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    
    const [page, setPage] = useState(1)

    const [searchGame, setSearchGame] = useState("")
    const [searchWarehouse, setSearchWarehouse] = useState("")
    const [searchMovementType, setSearchMovementType] = useState("")
    
    const [movementlist, setMovementList] = useState<MovementType[]>([])
    const [movementlistGames, setMovementListGames] = useState<MovementType[]>([])
    const [movementlistWarehouse, setMovementListWarehouse] = useState<MovementType[]>([])
    const [movementlisttype, setMovementListType] = useState<MovementType[]>([])
    
    const [getData] = searchMovements(searchGame, searchWarehouse, searchMovementType , page);
    const [getDataGames] = searchMovements("", "", "", 0);
    const [getDataWarehouse] = searchMovements("", "", "", 0);
    const [getDataType] = searchMovements("", "", "", 0);







    useEffect(() => {

        if (getData) {
            setMovementList(getData as MovementType[])
            //Reset to page 1 if when filtered list results <= 4 
            if (movementlist.length <= 4) {
                setPage(1)
            }
        }

        if(getDataGames){
            setMovementListGames(getDataGames as MovementType[])
        }

        if(getDataWarehouse){
            setMovementListWarehouse(getDataWarehouse as MovementType[])
        }

        if(getDataType){
            setMovementListType(getDataType as MovementType[])
        }

        

        
        console.log("jogo " + searchGame);
        console.log("Warehouse " + searchWarehouse);

    }, [getData, getDataGames, getDataWarehouse, getDataType]);

   
   
    console.log(fetchError)


    return (
        <div>

            <div className="card w-full bg-base-100 shadow-xl">
                <h5 className="card-title">
                    Movements
                </h5>
                <br />
                <form className="flex flex-col gap-4">
                    <div>
                        <select className="select select-primary w-full" id="searchgame" name='searchgame' onChange={(e) => setSearchGame(e.target.value)}>
                            <option value={""}>Choose Game</option>
                            <optgroup label="Games">
                                {movementlistGames.filter((value, index, self) =>
                                    index === self.findIndex((t) => (
                                        t.id_game === value.id_game))
                                ).map((game, index) =>
                                    <option key={index} value={game.id_game}>{game.game.name}</option>
                                )}
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <select className="select select-primary w-full" id="searchwarehouse" name='searchwarehouse' onChange={(e) => setSearchWarehouse(e.target.value)}>
                            <option value={""}>Choose Warehouse</option>
                            <optgroup label="Warehouse">
                                {movementlistWarehouse.filter((value, index, self) =>
                                    index === self.findIndex((t) => (
                                        t.id_warehouse === value.id_warehouse))
                                ).map((warehouse, index) =>
                                    <option key={index} value={warehouse.id_warehouse}>{warehouse.warehouse.location}</option>
                                )}
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <select className="select select-primary w-full" id="searchwarehouse" name='searchwarehouse' onChange={(e) => setSearchMovementType(e.target.value)}>
                            <option value={""}>Choose Movement Type</option>
                            <optgroup label="Movement Type">
                                {movementlisttype.filter((value, index, self) =>
                                    index === self.findIndex((t) => (
                                        t.movement_type === value.movement_type))
                                ).map((type, index) =>
                                    <option key={index} value={type.movement_type}>{type.movement_type}</option>
                                )}
                            </optgroup>
                        </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button  className="btn btn-outline btn-primary btn-sm" onClick={() => {setSearchGame(""); setSearchWarehouse(""); setSearchMovementType("")}}>Reset Search</button>
                    </div>
                </form>
                <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} fetchSuccess={fetchSuccess} setFetchSuccess={setFetchSuccess} />
                <br />
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                            <th>Movement ID</th>
                            <th>Game ID</th>
                            <th>Game Name </th>
                            <th>Warehouse ID</th>
                            <th>Warehouse Location</th>
                            <th>Movement Type</th>
                            <th>Quantity</th>
                            <th>Movement Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movementlist.map((movement) =>
                                <tr key={movement.id_movement}>
                                    <td>{movement.id_movement}</td>
                                    <td>{movement.id_game}</td>
                                    <td>{movement.game.name}</td>
                                    <td>{movement.id_warehouse}</td>
                                    <td>{movement.warehouse.location}</td>
                                    <td>{movement.movement_type}</td>
                                    <td>{movement.quantity}</td>
                                    <td>{new Date(movement.movement_date).toLocaleString(
                                    undefined, {day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: false})}
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
                            (movementlist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <a className="btn btn-outline btn-primary" href="/PublisherCreate">Create New</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
