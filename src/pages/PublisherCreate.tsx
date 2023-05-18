import { supabase } from '../lib/supabase';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

//Components
import { PublisherType } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';


export function PublisherCreate() {

  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
  const [publisher, setPublisher] = useState<PublisherType>({
    img_url: './src/lib/img/default.png',
    name: '',
    country: '',
    year: 0,
    state: ''
  });

 //window.confirm("Confirm create Publisher"
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
      .insert({ img_url: publisher.img_url, name: publisher.name, country: publisher.country, year: publisher.year, state: publisher.state })
      .select() //return record (data)

    if (error) {
      console.log(error)
      setFetchError(error.message)
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Publisher created successfully")
      navigate('/Publisher')
    }
  }


  console.log(publisher)
  console.log(fetchError)

  return (

    <div className="card w-full bg-base-100 shadow-xl">
      <h5 className="card-title">
        Add new Publisher
      </h5>
      <br />
      <ErrorAlert fetchError={fetchError} setFetchError={setFetchError}/>
      <br />
      <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
      {/* <form id="form1" onSubmit={() => window.confirm("Confirm create Publisher") && handleSunmit} className="flex flex-col gap-4"> */}
        <div className="form-control">
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Box Art</label>
          <input className="input input-bordered input-primary w-full"
            id="img_url"
            name='img_url'
            type="text"
            defaultValue={"./src/lib/img/default.png"}
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Name</label>
          <input className="input input-bordered input-primary w-full"
            id="name"
            name='name'
            type="text"
            placeholder="Insert Publisher Name"
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Country</label>
          <input className="input input-bordered input-primary w-full"
            id="country"
            name='country'
            type="text"
            placeholder="Insert Publisher Country"
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="year">Year</label>
          <input className="input input-bordered input-primary w-full"
            id="year"
            name='year'
            type="number"
            placeholder="Insert Publisher Year"
            onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })} />
          <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
          <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setPublisher({ ...publisher, [e.target.name]: e.target.value })}>
            <option value={""}>Choose State</option>
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

