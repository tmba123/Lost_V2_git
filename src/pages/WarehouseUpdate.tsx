
import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

//Components
import { WarehouseType } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';


export function WarehouseUpdate () {

  const [defaultstate, setDefaultState] = useState("")
  const { id } = useParams();
  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
  
  const [warehouse, setWarehouse] = useState<WarehouseType>({
    location:'',
    state: ''
  });

  useEffect(() => {
    const getPublisher = async () => {
      const { data, error } = await supabase
        .from('warehouse')
        .select("*")
        .eq('id_warehouse', id)
        .single()

      if (error) {
        navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
      }
      if (data) {
        setDefaultState(data.state)

        setWarehouse({
          id_warehouse: parseInt(id!),
          location: data.location,
          state: data.state
        })
      }
    }
    getPublisher()
  }, [id, navigate])

  //console.log(publisher)

  const handleSunmit = async (e: any) => {
    e.preventDefault()

    if (!warehouse.location || !warehouse.state) {
      setFetchError("All fields are required")
      return
    }
      else if (defaultstate == "enabled" && warehouse.state == "disabled"){

          console.log("entrou no disabel check!!!")
          

          const getInventory = async () => {
              const { data, error } = await supabase
                  .from('inventory')
                  .select("*")                 
                  .eq('id_warehouse', id)
                  .limit(1) //Solves error JSON object requested, multiple (or no) rows returned
                  .single()
  
              if (error) {
                  setFetchError(error.message)
                  navigate('/Warehouse', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
              }
              if (data) {
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
      console.log(error)
      setFetchError(error.message)
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Warehouse updated successfully")
      navigate('/Warehouse')


    }
  }


  return (

    <div className="card w-full bg-base-100 shadow-xl">
      <h5 className="card-title">
        Edit Warehouse
      </h5>
      <br />
      <ErrorAlert fetchError={fetchError} setFetchError={setFetchError}/>
      <br />
      <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
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
            <button className="btn btn-outline btn-primary" onClick={() => navigate('/Warehouse')}>Back</button>
            <button className="btn btn-outline btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>

    </div>
  )
}

