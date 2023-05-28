import { Helmet, HelmetProvider } from "react-helmet-async"
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'


//Components
import { InventoryType } from "../context/LostGamesContext"
import { searchInventory } from "../context/InventorySearch"
import { ErrorAlert } from '../components/Alerts'
import { AppContext } from '../context/AppContext'




export const Inventory = () => {

    const navigate = useNavigate()
    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages
    const [searchGame, setSearchGame] = useState("") //Used to Filter Inventory list
    const [searchWarehouse, setSearchWarehouse] = useState("") //Used to Filter Inventory list
    const [page, setPage] = useState(1) //Pagination
    const [inventorylist, setInventoryList] = useState<InventoryType[]>([]) //Inventory List
    const [inventorylistGames, setInventoryListGames] = useState<InventoryType[]>([]) //Inventory List used to filter by Game
    const [inventorylistWarehouse, setInventoryListWarehouse] = useState<InventoryType[]>([]) //Inventory List used to filter by Warehouse
    const [getData] = searchInventory(searchGame, searchWarehouse, "", page) //Get list with Pagination
    const [getDataGames] = searchInventory("", searchWarehouse, "", 0) //Get list with Pagination
    const [getDataWarehouse] = searchInventory(searchGame, "", "", 0) //Get list without pagination






    useEffect(() => {

        if (getData) {
            setInventoryList(getData as InventoryType[])
            //Reset to page 1 if when filtered list results <= 4 
            if (inventorylist.length <= 4) {
                setPage(1)
            }
        }

        if (getDataGames) {
            setInventoryListGames(getDataGames as InventoryType[])
        }

        if (getDataWarehouse) {
            setInventoryListWarehouse(getDataWarehouse as InventoryType[])
        }


    }, [getData, getDataGames, getDataWarehouse])


    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lost Videogames - Inventory</title>
            </Helmet>

            <div>

                <div className="card w-full bg-base-100 shadow-xl">
                    <h5 className="card-title">
                        Inventory
                    </h5>
                    <br />
                    <div className="flex flex-col gap-4">
                        <div>
                            <select className="select select-primary w-full" id="searchgame" name='searchgame' value={searchGame} onChange={(e) => setSearchGame(e.target.value)}>
                                <option value={""}>Choose Game</option>
                                <optgroup label="Games">
                                    {inventorylistGames.filter((value, index, self) => // Filters and removes duplicates (games) from list
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
                                    {inventorylistWarehouse.filter((value, index, self) => // Filters and removes duplicates (warehouses) from list
                                        index === self.findIndex((t) => (
                                            t.id_warehouse === value.id_warehouse))
                                    ).map((warehouse, index) =>
                                        <option key={index} value={warehouse.id_warehouse}>{warehouse.warehouse?.location}</option>
                                    )}
                                </optgroup>
                            </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="btn btn-outline btn-primary btn-sm" onClick={() => { setSearchGame(""); setSearchWarehouse("") }}>Reset Search</button>
                        </div>
                    </div>
                    <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} fetchSuccess={fetchSuccess} setFetchSuccess={setFetchSuccess} />
                    <br />
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Game ID</th>
                                    <th>Game Name</th>
                                    <th>Box Art</th>
                                    <th>Warehouse ID</th>
                                    <th>Warehouse Location</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventorylist.map((inventory, index) =>
                                    <tr key={index}>
                                        <td>{inventory.id_game}</td>
                                        <td>{inventory.game?.name}</td>
                                        <td><img className="w-14 h-14 object-contain max-w-full object-center" alt="boxart" src={inventory.game?.img_url}></img></td>
                                        <td>{inventory.id_warehouse}</td>
                                        <td>{inventory.warehouse?.location}</td>
                                        <td>{inventory.quantity}</td>
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
                                (inventorylist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button>
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
