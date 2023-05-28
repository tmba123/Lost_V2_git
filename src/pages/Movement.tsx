import { Helmet, HelmetProvider } from "react-helmet-async"
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

//Components
import { MovementType } from "../context/LostGamesContext"
import { searchMovements } from "../context/MovementSearch"
import { ErrorAlert } from '../components/Alerts'
import { AppContext } from '../context/AppContext'




export const Movement = () => {

    const navigate = useNavigate()
    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages

    const [page, setPage] = useState(1) //Pagination

    const [searchGame, setSearchGame] = useState("") //Used to Filter Movements list
    const [searchWarehouse, setSearchWarehouse] = useState("") //Used to Filter Movements list
    const [searchMovementType, setSearchMovementType] = useState("") //Used to Filter Movements list

    const [movementlist, setMovementList] = useState<MovementType[]>([]) //Movements List
    const [movementlistGames, setMovementListGames] = useState<MovementType[]>([]) //Movements List used to filter by Game
    const [movementlistWarehouse, setMovementListWarehouse] = useState<MovementType[]>([]) //Movements List used to filter by Warehouse
    const [movementlisttype, setMovementListType] = useState<MovementType[]>([]) //Movements List used to filter by Movement Type

    const [getData] = searchMovements(searchGame, searchWarehouse, searchMovementType, page) //Get list with Pagination
    const [getDataGames] = searchMovements("", searchWarehouse, searchMovementType, 0) //Get list with Pagination
    const [getDataWarehouse] = searchMovements(searchGame, "", searchMovementType, 0) //Get list with Pagination
    const [getDataMovementType] = searchMovements(searchGame, searchWarehouse, "", 0) //Get list with Pagination







    useEffect(() => {

        if (getData) {
            setMovementList(getData as MovementType[])
            //Reset to page 1 if when filtered list results <= 4 
            if (movementlist.length <= 4) {
                setPage(1)
            }
        }

        if (getDataGames) {
            setMovementListGames(getDataGames as MovementType[])
        }

        if (getDataWarehouse) {
            setMovementListWarehouse(getDataWarehouse as MovementType[])
        }

        if (getDataMovementType) {
            setMovementListType(getDataMovementType as MovementType[])
        }

    }, [getData, getDataGames, getDataWarehouse, getDataMovementType])


    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lost Videogames - Movements</title>
            </Helmet>

            <div>

                <div className="card w-full bg-base-100 shadow-xl">
                    <h5 className="card-title">
                        Movements
                    </h5>
                    <br />
                    <div className="flex flex-col gap-4">
                        <div>
                            <select className="select select-primary w-full" id="searchgame" name='searchgame' value={searchGame} onChange={(e) => setSearchGame(e.target.value)}>
                                <option value={""}>Choose Game</option>
                                <optgroup label="Games">
                                    {movementlistGames.filter((value, index, self) => // Filters and removes duplicates (games) from list
                                        index === self.findIndex((t) => (
                                            t.id_game === value.id_game))
                                    ).map((game, index) =>
                                        <option key={index} value={game.id_game}>{game.game?.name}</option>
                                    )}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <select className="select select-primary w-full" id="searchwarehouse" name='searchwarehouse' value={searchWarehouse} onChange={(e) => setSearchWarehouse(e.target.value)}>
                                <option value={""}>Choose Warehouse</option>
                                <optgroup label="Warehouse">
                                    {movementlistWarehouse.filter((value, index, self) => // Filters and removes duplicates (warehouses) from list
                                        index === self.findIndex((t) => (
                                            t.id_warehouse === value.id_warehouse))
                                    ).map((warehouse, index) =>
                                        <option key={index} value={warehouse.id_warehouse}>{warehouse.warehouse?.location}</option>
                                    )}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <select className="select select-primary w-full" id="movementtype" name='movementtype' value={searchMovementType} onChange={(e) => setSearchMovementType(e.target.value)}>
                                <option value={""}>Choose Movement Type</option>
                                <optgroup label="Movement Type">
                                    {movementlisttype.filter((value, index, self) => // Filters and removes duplicates (movementType) from list
                                        index === self.findIndex((t) => (
                                            t.movement_type === value.movement_type))
                                    ).map((type, index) =>
                                        <option key={index} value={type.movement_type}>{type.movement_type}</option>
                                    )}
                                </optgroup>
                            </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="btn btn-outline btn-primary btn-sm" onClick={() => { setSearchGame(""); setSearchWarehouse(""); setSearchMovementType("") }}>Reset Search</button>
                        </div>
                    </div>
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
                                        <td>{movement.game?.name}</td>
                                        <td>{movement.id_warehouse}</td>
                                        <td>{movement.warehouse?.location}</td>
                                        <td>{movement.movement_type}</td>
                                        <td>{movement.quantity}</td>
                                        <td>{movement.movement_date ? ( //Format Date to the desired presentation
                                            new Date(movement.movement_date).toLocaleString(undefined, {
                                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
                                                minute: '2-digit', hour12: false
                                            })) : ('')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <br />
                        <div className="btn-group">
                            <button className="btn btn-outline btn-sm" onClick={() => setPage(Math.max(page - 1, 1))}>«</button> {/* If (page-1 < 1) set page to 1 stops pagination at page 1  */}
                            <button className="btn btn-outline btn-sm">{page}</button>
                            <button className="btn btn-outline btn-sm" onClick={() =>
                                //Reset to page 1 if last page avoid error "Requested range not satisfiable from supabase"
                                (movementlist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/MovementCreate')}>Create Movement</button>
                        </div>
                    </div>
                </div>
            </div>
        </HelmetProvider>
    )
}
