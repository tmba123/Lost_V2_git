
import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

//Components
import { PublisherType } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';


export function PublisherUpdate () {

  
  const { id } = useParams();
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
  const navigate = useNavigate()
  const [publisher, setPublisher] = useState<PublisherType>({
    id_publisher: parseInt(id!),
    img_url: '',
    name: '',
    country: '',
    year: 0,
    state: ''
  });

  useEffect(() => {
    const getPublisher = async () => {
      const { data, error } = await supabase
        .from('publisher')
        .select("*")
        .eq('id_publisher', id)
        .single()

      if (error) {
        navigate('/Publisher', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
      }
      if (data) {
        setPublisher({
          id_publisher: parseInt(id!),
          img_url: data.img_url,
          name: data.name,
          country: data.country,
          year: data.year,
          state: data.state
        })
      }
    }
    getPublisher()
  }, [id, navigate])

  //console.log(publisher)

  const handleSunmit = async (e: any) => {
    e.preventDefault()

    if (!publisher.img_url || !publisher.name || !publisher.country || !publisher.state) {
      setFetchError("All fields are required")
      return
    } else if (publisher.year < 1889 || publisher.year > new Date().getFullYear()) {
      setFetchError(`Year value must be between 1900 and ${new Date().getFullYear()}`)
      return
    }

    const { data, error } = await supabase
      .from('publisher')
      .update({ img_url: publisher.img_url, name: publisher.name, country: publisher.country, year: publisher.year, state: publisher.state })
      .eq('id_publisher', publisher.id_publisher)
      .select() //return record (data)

    if (error) {
      console.log(error)
      setFetchError(error.message)
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Publisher updated successfully")
      navigate('/Publisher')


    }
  }


  return (

    <div className="card w-full bg-base-100 shadow-xl">
      <h5 className="card-title">
        Edit Publisher
      </h5>
      <br />
      <ErrorAlert fetchError={fetchError} setFetchError={setFetchError}/>
      <br />
      <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Publisher ID</label>
          <input className="input input-bordered input-primary w-full"
            id="id_publisher"
            name='id_publisher'
            type="number"
            value={publisher.id_publisher}
            disabled />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Box Art</label>
          <input className="input input-bordered input-primary w-full"
            id="img_url"
            name='img_url'
            type="text"
            value={publisher.img_url}
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Name</label>
          <input className="input input-bordered input-primary w-full"
            id="name"
            name='name'
            type="text"
            value={publisher.name}
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Country</label>
          <input className="input input-bordered input-primary w-full"
            id="country"
            name='country'
            type="text"
            value={publisher.country}
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="year">Year</label>
          <input className="input input-bordered input-primary w-full"
            id="year"
            name='year'
            type="number"
            value={publisher.year}
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
          <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })}>
            <option value={publisher.state}>{publisher.state}</option>
            <optgroup label="State">
              <option value={"enabled"}>Enabled</option>
              <option value={"disabled"}>Disabled</option>
            </optgroup>
          </select>
          <br />
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-outline btn-primary" onClick={() => navigate('/Publisher')}>Back</button>
            <button className="btn btn-outline btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>

    </div>
  )
}