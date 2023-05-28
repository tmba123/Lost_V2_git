import { Helmet, HelmetProvider } from "react-helmet-async"
import { supabase } from '../lib/supabase'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

//Components
import { WarehouseType } from "../context/LostGamesContext"
import { ErrorAlert } from '../components/Alerts'


export function WarehouseCreate() {

  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages
  const [warehouse, setWarehouse] = useState<WarehouseType>({ // Default empty Warehouse
    location: '',
    state: ''
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!warehouse.location || !warehouse.state) {
      setFetchError("All fields are required")
      return
    }

    const { data, error } = await supabase
      .from('warehouse')
      .insert({ location: warehouse.location, state: warehouse.state })
      .select() //return record (data)

    if (error) {
      setFetchError("Something Went Wrong, Please Try Again.")
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Warehouse created successfully")
      navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
    }
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lost Videogames - Create Warehouse</title>
      </Helmet>
      <div className="card w-full bg-base-100 shadow-xl">
        <h5 className="card-title">
          Add new Warehouse
        </h5>
        <br />
        <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} />
        <br />
        <form id="form1" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="location">Location</label>
            <input className="input input-bordered input-primary w-full"
              id="location"
              name='location'
              type="text"
              placeholder="Insert Warehouse Name"
              onChange={(e) => setWarehouse({ ...warehouse, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
            <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setWarehouse({ ...warehouse, [e.target.name]: e.target.value })}>
              <option value={""}>Choose State</option>
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

