import { Helmet, HelmetProvider } from "react-helmet-async"
import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

//Components
import { WarehouseType } from "../context/LostGamesContext"
import { ErrorAlert } from '../components/Alerts'


export function WarehouseUpdate() {

  const [defaultstate, setDefaultState] = useState("") // Used to get initial state value from selected warehouse
  const { id } = useParams() //Selected warehouse id from Warehouse page 
  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages

  const [warehouse, setWarehouse] = useState<WarehouseType>({
    id_warehouse: parseInt(id!),
    location: '',
    state: ''
  })

  useEffect(() => {
    const getWarehouse = async () => { //Set´s Warehouse with the default data from the DB for the selected id_warehouse
      const { data, error } = await supabase
        .from('warehouse')
        .select("*")
        .eq('id_warehouse', id)
        .single()

      if (error) {
        navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
      }
      if (data) {
        setDefaultState(data.state) // Set´s initial state value from selected warehouse

        setWarehouse({
          id_warehouse: parseInt(id!),
          location: data.location,
          state: data.state
        })
      }
    }
    getWarehouse()
  }, [id, navigate])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!warehouse.location || !warehouse.state) {
      setFetchError("All fields are required")
      return
    }
    else if (defaultstate == "enabled" && warehouse.state == "disabled") {

      //Validation if warehouse can be disabled meaning no record for this warehouse in the inventory table  

      const getInventory = async () => {
        const { data, error } = await supabase
          .from('inventory')
          .select("*")
          .eq('id_warehouse', id)
          .limit(1) //Solves error JSON object requested, multiple (or no) rows returned
          .single()

        if (error) { // No record, OK to disable

          const { data, error } = await supabase
            .from('warehouse')
            .update({ location: warehouse.location, state: warehouse.state })
            .eq('id_warehouse', warehouse.id_warehouse)
            .select() //return record (data)

          if (error) {
            setFetchError("Something Went Wrong, Please Try Again.")
          }
          if (data) {
            setFetchError("")
            setFetchSuccess("Warehouse updated successfully")
            navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.


          }
        }
        if (data) { //Record in inventory table, NOK to disable 
          setFetchError("Warehouse contains products! Cannot be disabled.")
        }
      }
      getInventory()

      return
    }

    const { data, error } = await supabase
      .from('warehouse')
      .update({ location: warehouse.location, state: warehouse.state })
      .eq('id_warehouse', warehouse.id_warehouse)
      .select() //return record (data)

    if (error) {
      setFetchError("Something Went Wrong, Please Try Again.")
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Warehouse updated successfully")
      navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
    }
  }


  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lost Videogames - Update Warehouse</title>
      </Helmet>
      <div className="card w-full bg-base-100 shadow-xl">
        <h5 className="card-title">
          Edit Warehouse
        </h5>
        <br />
        <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} />
        <br />
        <form id="form1" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Warehouse ID</label>
            <input className="input input-bordered input-primary w-full"
              id="id_warehouse"
              name='id_warehouse'
              type="number"
              value={warehouse.id_warehouse}
              disabled />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Location</label>
            <input className="input input-bordered input-primary w-full"
              id="location"
              name='location'
              type="text"
              value={warehouse.location}
              onChange={(e) => setWarehouse({ ...warehouse, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
            <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setWarehouse({ ...warehouse, [e.target.name]: e.target.value })}>
              <option value={warehouse.state}>{warehouse.state}</option>
              <optgroup label="State">
                <option value={"enabled"}>Enabled</option>
                <option value={"disabled"}>Disabled</option>
              </optgroup>
            </select>
            <br />
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/Warehouse', { replace: true })}>Back</button>
              <button className="btn btn-outline btn-primary btn-sm" type="submit">Submit</button>
            </div>
          </div>
        </form>

      </div>
    </HelmetProvider>
  )
}

