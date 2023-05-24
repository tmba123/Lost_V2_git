import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


//Components
import { GameType, WarehouseType, InventoryType } from "../context/LostGamesContext";
import { searchGames } from "../context/GameSearch";
import { searchWarehouse } from "../context/WarehouseSearch";
import { ErrorAlert } from '../components/Alerts';
import { AppContext } from '../context/AppContext';



export const MovementCreate = () => {


    const navigate = useNavigate()

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    const [searchTextGames, setSearchTextGames] = useState("")
    const [searchTextWarehouse, setSearchTextWarehouse] = useState("")
    const [movementType, setMovementType] = useState("")
    const [quantity, setQuantity] = useState(0)

    const [gameList, setGameList] = useState<GameType[]>([])
    const [warehouseList, setWarehouseList] = useState<WarehouseType[]>([])

    const [getDataGames] = searchGames("name", searchTextGames, "enabled", 0);
    const [getDataWarehouse] = searchWarehouse("location", searchTextWarehouse, "enabled", 0);

    const [inventory, setInventory] = useState<InventoryType>({
        id_game: 0,
        id_warehouse: 0,
        quantity: 0,
    });


    useEffect(() => {


        if (getDataGames) {
            setGameList(getDataGames as GameType[])
        }

        if (getDataWarehouse) {
            setWarehouseList(getDataWarehouse as WarehouseType[])
        }

    }, [getDataGames, getDataWarehouse, movementType]);


    const handleSunmit = async (e: any) => {
        e.preventDefault()

        if (movementType == "add_stock") { 

            if (inventory.id_game == 0 || inventory.id_warehouse == 0 || quantity == 0) {
                setFetchError("All fields are required")
                return
            }

            const { data: initData, error: initError } = await supabase

                .from('inventory')
                .select("*")
                .eq("id_game", inventory.id_game)
                .eq("id_warehouse", inventory.id_warehouse)
                .limit(1)
                .single();

            if (initError) { // If error no previous data exists for the combination id_game/id_warehouse – create new entry
                const { data: createInventoryData, error: createInventoryError } = await supabase
                    .from('inventory')
                    .insert({
                        id_game: inventory.id_game,
                        id_warehouse: inventory.id_warehouse,
                        quantity: quantity
                    })
                    .select() //return record (data)

                if (createInventoryError) {
                    setFetchError(createInventoryError.message)
                }
                if (createInventoryData) {
                    setFetchError("")

                    const { data: createMovementData, error: createMovementError } = await supabase
                    .from('movement')
                    .insert({
                        id_game: inventory.id_game,
                        id_warehouse: inventory.id_warehouse,
                        movement_type: movementType,
                        quantity: quantity
                    })
                    .select() //return record (data)

                if (createMovementError) { // Deletes inventory entry if movement create error
                    const { } = await supabase
                    .from('inventory')
                    .delete()
                    .eq("id_game", inventory.id_game)
                    .eq("id_warehouse", inventory.id_warehouse)
                    
                    setFetchError(createMovementError.message)
                }
                if (createMovementData) {
                    setFetchError("")
                    setFetchSuccess("Stock Added successfully")
                    navigate('/Movement')
                }

                }
            }

            if (initData) { //If data, data exists for the combination id_game/id_warehouse – update entry

                const { data: updateInventoryData, error: updateInventoryError } = await supabase
                    .from('inventory')
                    .update({quantity: (initData.quantity + quantity)})
                    .eq("id_game", inventory.id_game)
                    .eq("id_warehouse", inventory.id_warehouse)
                    .select() //return record (data)

                if (updateInventoryError) {
                    console.log(updateInventoryError)
                    setFetchError(updateInventoryError.message)
                }
                if (updateInventoryData) {
                    setFetchError("")

                    const { data: createMovementData, error: createMovementError } = await supabase
                    .from('movement')
                    .insert({
                        id_game: inventory.id_game,
                        id_warehouse: inventory.id_warehouse,
                        movement_type: movementType,
                        quantity: quantity
                    })
                    .select() //return record (data)

                if (createMovementError) { // Updates inventory entry to initial state if movement create error
                    const { } = await supabase
                    .from('inventory')
                    .update({quantity: (initData.quantity)})
                    .eq("id_game", inventory.id_game)
                    .eq("id_warehouse", inventory.id_warehouse)
                    .select() //return record (data)
                    
                    setFetchError(createMovementError.message)
                }
                if (createMovementData) {
                    setFetchError("")
                    setFetchSuccess("Stock Updated successfully")
                    navigate('/Movement')
                }

                }
            }
        }
    }

    return (
        <div>

            <div className="card w-full bg-base-100 shadow-xl">
                <h5 className="card-title">
                    New Movement
                </h5>
                <br />
                <form className="flex flex-col gap-4">
                    <div>
                        <select aria-label="label for the select" className="select select-primary w-full" id="movementtype" name='movementtype' onChange={(e) => setMovementType(e.target.value)}>
                            <option value={""}>Choose Movement Type</option>
                            <optgroup label="Criteria">
                                <option value="add_stock">Add Stock</option>
                                <option value="remove_stock">Remove Stock</option>
                                <option value="in_transit">In Transit</option>
                            </optgroup>
                        </select>
                    </div>
                    <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} fetchSuccess={fetchSuccess} setFetchSuccess={setFetchSuccess} />
                </form>
                <br />
                {movementType == "add_stock" ? (

                    <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
                        <div className="form-control">

                            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="searchtext">Game</label>
                            <input className="input input-bordered input-primary w-full"
                                list="gamelist"
                                id="datalist1"
                                name="id_game"
                                placeholder="Search Game"
                                autoComplete='off'
                                //Game name + platform combination is unique if it finds name + platform == value sets inventory id_game, setSearchText to filter gamelist
                                onChange={(e) => { setInventory({ ...inventory, [e.target.name]: gameList.find((game) => game.name + " - Platform: " + game.platform == e.target.value)?.id_game }); setSearchTextGames(e.target.value) }} />

                            <datalist id="gamelist">
                                {gameList.map((game) =>
                                    <option key={game.id_game} value={game.name + " - Platform: " + game.platform}></option>
                                )}
                            </datalist>

                            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="searchtext">Warehouse</label>
                            <input className="input input-bordered input-primary w-full"
                                list="warehouselist"
                                id="datalist2"
                                name="id_warehouse"
                                placeholder="Search Warehouse"
                                autoComplete='off'
                                //Warehouse location is unique if it finds location == value sets inventory id_warehouse, setSearchText to filter publisherlist
                                onChange={(e) => { setInventory({ ...inventory, [e.target.name]: warehouseList.find((warehouse) => warehouse.location == e.target.value)?.id_warehouse }); setSearchTextWarehouse(e.target.value) }} />

                            <datalist id="warehouselist">
                                {warehouseList.map((warehouse) =>
                                    warehouse.location != "Transit" ? (
                                        <option key={warehouse.id_warehouse} value={warehouse.location}></option>
                                    ) : null)}
                            </datalist>

                            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Quantity</label>
                            <input className="input input-bordered input-primary w-full"
                                id="quantity"
                                name='quantity'
                                type="number"
                                min="1"
                                placeholder="Insert quantity"
                                onChange={(e) => setQuantity(parseInt(e.target.value))} />

                            <br />
                            <div className="flex flex-wrap items-center gap-2">

                                <button className="btn btn-outline btn-primary btn-sm" type="submit">Submit</button>
                            </div>

                        </div>
                    </form>

                ) : null}
                <br />
                <div className="flex flex-wrap items-center gap-2">
                    <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/Movement')}>Back</button>
                </div>
            </div>
        </div>

    )
}
