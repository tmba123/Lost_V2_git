import { Helmet, HelmetProvider } from "react-helmet-async"
import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


//Components
import { PublisherType, GameType } from "../context/LostGamesContext"
import { searchPublishers } from "../context/PublisherSearch"
import { ErrorAlert } from '../components/Alerts'


export function GameCreate() {

  const navigate = useNavigate()
  const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext) //Set success/error messages
  const [searchText, setSearchText] = useState("") //Used to Filter Publishers list
  const [publisherlist, setPublisherList] = useState<PublisherType[]>([]) // Publisher list
  const [getData] = searchPublishers("name", searchText, "enabled", 0) //Get publisher list with filter options
  const [game, setGame] = useState<GameType>({ // Default empty Game
    id_publisher: 0,
    img_url: './src/lib/img/default.png',
    name: '',
    genre: '',
    platform: '',
    release_year: 0,
    state: ''
  })



  useEffect(() => {

    if (getData) {
      setPublisherList(getData as PublisherType[])
    }

  }, [getData])


  const handleSunmit = async (e: any) => {
    e.preventDefault()

    if (game.id_publisher == 0 || !game.img_url || !game.name || !game.genre || !game.platform || !game.state) {
      setFetchError("All fields are required")
      return
    } else if (game.release_year < 1889 || game.release_year > new Date().getFullYear()) {
      setFetchError(`Year value must be between 1900 and ${new Date().getFullYear()}`)
      return
    }

    const { data, error } = await supabase
      .from('game')
      .insert({
        id_publisher: game.id_publisher,
        img_url: game.img_url,
        name: game.name,
        genre: game.genre,
        platform: game.platform,
        release_year: game.release_year,
        state: game.state
      })
      .select() //return record (data)

    if (error) {
      setFetchError("Something Went Wrong, Please Try Again.")
    }
    if (data) {
      setFetchError("")
      setFetchSuccess("Game created successfully")
      navigate('/Games', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
    }
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lost Videogames - Create Game</title>
      </Helmet>
      <div className="card w-full bg-base-100 shadow-xl">
        <h5 className="card-title">
          Add new Game
        </h5>
        <br />
        <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} />
        <br />
        <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="searchtext">Publisher Name</label>
            <input className="input input-bordered input-primary w-full"
              list="publisher"
              id="datalist1"
              name="id_publisher"
              placeholder="Search Publisher"
              autoComplete='off'
              //Publisher name is unique if it finds name == value sets game id_publisher, setSearchText to filter publisherlist
              onChange={(e) => { setGame({ ...game, [e.target.name]: publisherlist.find((publisher) => publisher.name == e.target.value)?.id_publisher }); setSearchText(e.target.value) }} />

            <datalist id="publisher">
              {publisherlist.map((publisher) =>
                <option key={publisher.id_publisher} value={publisher.name}></option>
              )}
            </datalist>

            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Box Art</label>
            <input className="input input-bordered input-primary w-full"
              id="img_url"
              name='img_url'
              type="text"
              defaultValue={"./src/lib/img/default.png"}
              onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Name</label>
            <input className="input input-bordered input-primary w-full"
              id="name"
              name='name'
              type="text"
              placeholder="Insert Game Name"
              onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Genre</label>
            <input className="input input-bordered input-primary w-full"
              id="genre"
              name='genre'
              type="text"
              placeholder="Insert Game Genre"
              onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Platform</label>
            <input className="input input-bordered input-primary w-full"
              id="platform"
              name='platform'
              type="text"
              placeholder="Insert Game Platform"
              onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="year">Year</label>
            <input className="input input-bordered input-primary w-full"
              id="release_year"
              name='release_year'
              type="number"
              placeholder="Insert Game Year"
              onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
            <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
            <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })}>
              <option value={""}>Choose State</option>
              <optgroup label="State">
                <option value={"enabled"}>Enabled</option>
                <option value={"disabled"}>Disabled</option>
              </optgroup>
            </select>
            <br />
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/Games', { replace: true })}>Back</button>
              <button className="btn btn-outline btn-primary btn-sm" type="submit">Submit</button>
            </div>
          </div>
        </form>

      </div>
    </HelmetProvider>

  )
}