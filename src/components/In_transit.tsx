import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'


//Components
import { InventoryType, WarehouseType } from "../context/LostGamesContext"
import { searchInventory } from "../context/InventorySearch"
import { searchWarehouse } from "../context/WarehouseSearch"
import { AppContext } from '../context/AppContext'


export function In_transit() {

    const navigate = useNavigate()

    const { setFetchSuccess, setFetchError } = useContext(AppContext) //Set success/error messages
    const [searchGame, setSearchGame] = useState("") //Used to Filter Inventory list
    const [page, setPage] = useState(1) //Pagination

    const [inventorylist, setInventoryList] = useState<InventoryType[]>([]) //Inventory List
    const [inventorylistGames, setInventoryListGames] = useState<InventoryType[]>([]) //Inventory List used to filter by Game

    const [getData] = searchInventory(searchGame, "", "Transit", page) //Get list with filter options and pagination
    const [getDataGames] = searchInventory("", "", "Transit", 0) //Get list with filter options no pagination

    const [warehouseslist, setWarehousesList] = useState<WarehouseType[]>([]) //Warehouse list
    const [getDataWarehouse] = searchWarehouse("", "", "enabled", 0) //Get list with filter options no pagination


    const [selectedRow, setSelectedRow] = useState<InventoryType | null>(null) //Used to store table row data 

    const handleRowSelect = (inventory: InventoryType) => { //Set selectedRow with values from corresponding selected table row 
        setSelectedRow(inventory)
    }




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
            setWarehousesList(getDataWarehouse as WarehouseType[])
        }

        console.log(inventorylist)

    }, [getData, getDataGames, getDataWarehouse])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedRow) {

            //Extract values from the form on the selected row index within the inventorylist

            const formData = new FormData(e.target as HTMLFormElement) //HTMLFormElement to Access form data.
            const index = inventorylist.findIndex((inventory) => inventory === selectedRow) // Find the index of the selectedRow object within the inventorylist array
            const quantityToRemove = parseInt(formData.get(`quantityremove${index}`) as string) //Get quantityremove where it matches the index
            const newLocation = formData.get(`newlocation${index}`) as string //Get newlocation where it matches the index

            if (!quantityToRemove || !newLocation) {
                setFetchError("All fields are required")
                return
            } else if (quantityToRemove > selectedRow.quantity) {
                setFetchError("Inserted quantity superior to available quantity!")
                return

            }

            if ((selectedRow.quantity - quantityToRemove) == 0) { // Deletes inventory entry if remaining quantity = 0

                const { data: deleteInventoryData, error: deleteInventoryError } = await supabase
                    .from('inventory')
                    .delete()
                    .eq("id_game", selectedRow.id_game)
                    .eq("id_warehouse", selectedRow.id_warehouse)
                    .select() //return record (data)

                if (deleteInventoryError) {
                    setFetchError("Something Went Wrong, Please Try Again.")
                }

                if (deleteInventoryData) {
                    setFetchError("")
                    const { data: createMovementData, error: createMovementError } = await supabase
                        .from('movement')
                        .insert({
                            id_game: selectedRow.id_game,
                            id_warehouse: selectedRow.id_warehouse,
                            movement_type: "in_transit",
                            quantity: "-" + quantityToRemove
                        })
                        .select() //return record (data)


                    if (createMovementError) { // Updates inventory entry to initial state if movement create error
                        const { } = await supabase
                            .from('inventory')
                            .insert({
                                id_game: selectedRow.id_game,
                                id_warehouse: selectedRow.id_warehouse,
                                quantity: selectedRow.quantity
                            })

                        setFetchError("Something Went Wrong, Please Try Again.")
                    }

                    if (createMovementData) {

                        const { data: initData, error: initError } = await supabase

                            .from('inventory')
                            .select("*")
                            .eq("id_game", selectedRow.id_game)
                            .eq("id_warehouse", newLocation)
                            .limit(1)
                            .single()


                        if (initError) { // If error no previous data exists for the combination id_game/id_warehouse – create new entry
                            const { data: createInventoryData, error: createInventoryError } = await supabase
                                .from('inventory')
                                .insert({
                                    id_game: selectedRow.id_game,
                                    id_warehouse: newLocation,
                                    quantity: quantityToRemove
                                })
                                .select() //return record (data)

                            if (createInventoryError) {
                                setFetchError("Something Went Wrong, Please Try Again.")
                            }
                            if (createInventoryData) {
                                setFetchError("")

                                const { data: createMovementData, error: createMovementError } = await supabase
                                    .from('movement')
                                    .insert({
                                        id_game: selectedRow.id_game,
                                        id_warehouse: newLocation,
                                        movement_type: "in_transit",
                                        quantity: quantityToRemove
                                    })
                                    .select() //return record (data)

                                if (createMovementError) { // Deletes inventory entry if movement create error
                                    const { } = await supabase
                                        .from('inventory')
                                        .delete()
                                        .eq("id_game", selectedRow.id_game)
                                        .eq("id_warehouse", newLocation)

                                    setFetchError("Something Went Wrong, Please Try Again.")
                                }
                                if (createMovementData) {
                                    setFetchError("")
                                    setFetchSuccess("Stock Added successfully")
                                    navigate('/Movement', { replace: true })
                                }
                            }
                        } if (initData) { //If data, data exists for the combination id_game/id_warehouse – update entry
                            const { data: updateInventoryData, error: updateInventoryError } = await supabase
                                .from('inventory')
                                .update({ quantity: (initData.quantity + quantityToRemove) })
                                .eq("id_game", selectedRow.id_game)
                                .eq("id_warehouse", newLocation)
                                .select() //return record (data)

                            if (updateInventoryError) {
                                setFetchError("Something Went Wrong, Please Try Again.")
                            }
                            if (updateInventoryData) {
                                setFetchError("")

                                const { data: createMovementData, error: createMovementError } = await supabase
                                    .from('movement')
                                    .insert({
                                        id_game: selectedRow.id_game,
                                        id_warehouse: newLocation,
                                        movement_type: "in_transit",
                                        quantity: quantityToRemove
                                    })
                                    .select() //return record (data)

                                if (createMovementError) { // Updates inventory entry to initial state if movement create error
                                    const { } = await supabase
                                        .from('inventory')
                                        .update({ quantity: (initData.quantity) })
                                        .eq("id_game", selectedRow.id_game)
                                        .eq("id_warehouse", newLocation)
                                        .select() //return record (data)

                                    setFetchError("Something Went Wrong, Please Try Again.")
                                }
                                if (createMovementData) {
                                    setFetchError("")
                                    setFetchSuccess("Stock Updated successfully")
                                    navigate('/Movement', { replace: true })
                                }
                            }
                        }
                    }
                }

            } else { // Updates inventory entry

                const { data: updateInventoryData, error: updateInventoryError } = await supabase
                    .from('inventory')
                    .update({ quantity: (selectedRow.quantity - quantityToRemove) })
                    .eq("id_game", selectedRow.id_game)
                    .eq("id_warehouse", selectedRow.id_warehouse)
                    .select() //return record (data)

                if (updateInventoryError) {
                    setFetchError("Something Went Wrong, Please Try Again.")
                }
                if (updateInventoryData) {
                    setFetchError("")

                    const { data: createMovementData, error: createMovementError } = await supabase
                        .from('movement')
                        .insert({
                            id_game: selectedRow.id_game,
                            id_warehouse: selectedRow.id_warehouse,
                            movement_type: "in_transit",
                            quantity: "-" + quantityToRemove
                        })
                        .select() //return record (data)

                    if (createMovementError) { // Updates inventory entry to initial state if movement create error
                        const { } = await supabase
                            .from('inventory')
                            .update({ quantity: (selectedRow.quantity) })
                            .eq("id_game", selectedRow.id_game)
                            .eq("id_warehouse", selectedRow.id_warehouse)
                            .select() //return record (data)

                        setFetchError("Something Went Wrong, Please Try Again.")
                    }
                    if (createMovementData) {

                        const { data: initData, error: initError } = await supabase

                            .from('inventory')
                            .select("*")
                            .eq("id_game", selectedRow.id_game)
                            .eq("id_warehouse", newLocation)
                            .limit(1)
                            .single()

                        if (initError) { // If error no previous data exists for the combination id_game/id_warehouse – create new entry
                            const { data: createInventoryData, error: createInventoryError } = await supabase
                                .from('inventory')
                                .insert({
                                    id_game: selectedRow.id_game,
                                    id_warehouse: newLocation,
                                    quantity: quantityToRemove
                                })
                                .select() //return record (data)

                            if (createInventoryError) {
                                setFetchError("Something Went Wrong, Please Try Again.")
                            }

                            if (createInventoryData) {
                                setFetchError("")

                                const { data: createMovementData, error: createMovementError } = await supabase
                                    .from('movement')
                                    .insert({
                                        id_game: selectedRow.id_game,
                                        id_warehouse: newLocation,
                                        movement_type: "in_transit",
                                        quantity: quantityToRemove
                                    })
                                    .select() //return record (data)

                                if (createMovementError) { // Deletes inventory entry if movement create error
                                    const { } = await supabase
                                        .from('inventory')
                                        .delete()
                                        .eq("id_game", selectedRow.id_game)
                                        .eq("id_warehouse", newLocation)

                                    setFetchError("Something Went Wrong, Please Try Again.")
                                }
                                if (createMovementData) {
                                    setFetchError("")
                                    setFetchSuccess("Stock Added successfully")
                                    navigate('/Movement', { replace: true })
                                }
                            }
                        }
                        if (initData) { //If data, data exists for the combination id_game/id_warehouse – update entry
                            const { data: updateInventoryData, error: updateInventoryError } = await supabase
                                .from('inventory')
                                .update({ quantity: (initData.quantity + quantityToRemove) })
                                .eq("id_game", selectedRow.id_game)
                                .eq("id_warehouse", newLocation)
                                .select() //return record (data)

                            if (updateInventoryError) {
                                setFetchError("Something Went Wrong, Please Try Again.")
                            }

                            if (updateInventoryData) {
                                setFetchError("")

                                const { data: createMovementData, error: createMovementError } = await supabase
                                    .from('movement')
                                    .insert({
                                        id_game: selectedRow.id_game,
                                        id_warehouse: newLocation,
                                        movement_type: "in_transit",
                                        quantity: quantityToRemove
                                    })
                                    .select() //return record (data)

                                if (createMovementError) { // Updates inventory entry to initial state if movement create error
                                    const { } = await supabase
                                        .from('inventory')
                                        .update({ quantity: (initData.quantity) })
                                        .eq("id_game", selectedRow.id_game)
                                        .eq("id_warehouse", newLocation)
                                        .select() //return record (data)

                                    setFetchError("Something Went Wrong, Please Try Again.")
                                }
                                if (createMovementData) {
                                    setFetchError("")
                                    setFetchSuccess("Stock Updated successfully")
                                    navigate('/Movement', { replace: true })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return (
        <>
            <br />
            <h5 className="card-title">
                In Transit
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
                <div className="flex flex-wrap items-center gap-2">
                    <button className="btn btn-outline btn-primary btn-sm" onClick={() => { setSearchGame("") }}>Reset Search</button>
                </div>
            </div>
            <br />
            <div className="overflow-x-auto">
                <form id="form1" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Game Name</th>
                                <th>Box Art</th>
                                <th>Location</th>
                                <th>New Location</th>
                                <th>Available Quantity</th>
                                <th>Quantity to move</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventorylist.map((inventory, index) =>
                                <tr key={index} onClick={() => handleRowSelect(inventory)}>
                                    <td hidden>{inventory.id_game}</td>
                                    <td hidden>{inventory.id_warehouse}</td>
                                    <td>{inventory.game?.name}</td>
                                    <td><img className="w-14 h-14 object-contain max-w-full object-center" alt="boxart" src={inventory.game?.img_url}></img></td>
                                    <td>{inventory.warehouse?.location}</td>
                                    <td><select aria-label="label for the select" className="select select-primary w-full" id={`newlocation${index}`} name={`newlocation${index}`}>
                                        <option value={""}>Choose Warehouse</option>
                                        <optgroup label="Warehouse">
                                            {warehouseslist.map((warehouse) =>
                                                warehouse.location != "Transit" ? // Hides "Transit" warehouse from list
                                                    (<option key={warehouse.id_warehouse} value={warehouse.id_warehouse}>{warehouse.location}</option>)
                                                    : null
                                            )}
                                        </optgroup>
                                    </select>
                                    </td>
                                    <td>{inventory.quantity}</td>
                                    <td><input className="input input-bordered input-primary w-full"
                                        id={`quantityremove${index}`}
                                        name={`quantityremove${index}`}
                                        type="number"
                                        min="1"
                                        placeholder="Quantity to remove" />
                                    </td>
                                    <td><button className="btn btn-outline btn-primary btn-sm" type="submit">Confirm</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </form>
                <br />
                <div className="btn-group">
                    <button className="btn btn-outline btn-sm" onClick={() => setPage(Math.max(page - 1, 1))}>«</button> {/* If (page-1 < 1) set page to 1 stops pagination at page 1  */}
                    <button className="btn btn-outline btn-sm">{page}</button>
                    <button className="btn btn-outline btn-sm" onClick={() =>
                        //Reset to page 1 if last page avoid error "Requested range not satisfiable from supabase"
                        (inventorylist.length <= 4) ? setPage(1) : setPage(page + 1)}>»</button>
                </div>
            </div>
        </>
    )
}