import { Helmet, HelmetProvider } from "react-helmet-async"
import { supabase } from '../lib/supabase'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

//Components
import { PublisherType } from "../context/LostGamesContext"
import { ErrorAlert } from '../components/Alerts'


export function PublisherCreate() {

  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages
  const [publisher, setPublisher] = useState<PublisherType>({ // Default empty Publisher
    img_url: './src/lib/img/default.png',
    name: '',
    country: '',
    year: 0,
    state: ''
  })

  const handleSubmit = async (e: any) => {
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
      setFetchError("Something Went Wrong, Please Try Again.")
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Publisher created successfully")
      navigate('/Publisher', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
    }
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lost Videogames - Create Publisher</title>
      </Helmet>

      <div className="card w-full bg-base-100 shadow-xl">
        <h5 className="card-title">
          Add new Publisher
        </h5>
        <br />
        <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} />
        <br />
        <form id="form1" onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/Publisher', { replace: true })}>Back</button>
              <button className="btn btn-outline btn-primary btn-sm" type="submit">Submit</button>
            </div>
          </div>
        </form>

      </div>
    </HelmetProvider>
  )
}

