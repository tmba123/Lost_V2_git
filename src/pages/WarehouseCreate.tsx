import { supabase } from '../lib/supabase';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

//Components
import { WarehouseType } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';


export function WarehouseCreate() {

  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
  const [warehouse, setWarehouse] = useState<WarehouseType>({
    location:'',
    state: ''
  });

 //window.confirm("Confirm create Publisher"
  const handleSunmit = async (e: any) => {
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
      console.log(error)
      setFetchError(error.message)
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Warehouse created successfully")
      navigate('/Warehouse')
    }
  }


  console.log(warehouse)
  console.log(fetchError)

  return (

    <div className="card w-full bg-base-100 shadow-xl">
      <h5 className="card-title">
        Add new Warehouse
      </h5>
      <br />
      <ErrorAlert fetchError={fetchError} setFetchError={setFetchError}/>
      <br />
      <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
      {/* <form id="form1" onSubmit={() => window.confirm("Confirm create Publisher") && handleSunmit} className="flex flex-col gap-4"> */}
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
            <button className="btn btn-outline btn-primary" onClick={() => navigate('/Warehouse')}>Back</button>
            <button className="btn btn-outline btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>

    </div>

  )
}

