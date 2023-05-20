import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


//Components
import { PublisherType, GameType, searchLostGames } from "../context/LostGamesContext";
import { ErrorAlert } from '../components/Alerts';


export function GameUpdate() {

    const { id } = useParams();
    const navigate = useNavigate()
    const { setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);
    const [searchText, setSearchText] = useState("")
    const [publisherlist, setPublisherList] = useState<PublisherType[]>([])
    const [getData] = searchLostGames('publisher', "name", searchText, "enabled", 0);
    const [game, setGame] = useState<GameType>({
        id_game: parseInt(id!),
        id_publisher: 0,
        publisher: { name: '' },
        img_url: '',
        name: '',
        genre: '',
        platform: '',
        release_year: 0,
        state: ''
    });

    console.log(game)

    useEffect(() => {

        if (getData) {
            setPublisherList(getData as PublisherType[])
        }

    }, [getData]);

    useEffect(() => {

        const getGame = async () => {
            const { data, error } = await supabase
                .from('game')
                .select(`
                        id_game,
                        id_publisher,
                        publisher (name),
                        img_url,
                        name,
                        genre,
                        platform,
                        release_year,
                        state 
                        `)
                .eq('id_game', id)
                .single()

            if (error) {
                setFetchError(error.message)
                navigate('/Games', { replace: true }) //replace: true, the navigation will replace the current entry in the history stack instead of adding a new one.
            }
            if (data) {

                setGame({
                    id_game: parseInt(id!),
                    id_publisher: data.id_publisher,
                    publisher: { name: data.publisher?.name },
                    img_url: data.img_url,
                    name: data.name,
                    genre: data.genre,
                    platform: data.platform,
                    release_year: data.release_year,
                    state: data.state
                } as GameType)
            }
        }
        getGame()
        
    }, [id, navigate]);

    console.log(game)
    //window.confirm("Confirm create Publisher"
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
            .update({
                id_publisher: game.id_publisher,
                img_url: game.img_url,
                name: game.name,
                genre: game.genre,
                platform: game.platform,
                release_year: game.release_year,
                state: game.state
            })
            .eq('id_game', game.id_game)
            .select() //return record (data)

        if (error) {
            console.log(error)
            setFetchError(error.message)
        }
        if (data) {
            setFetchError("")
            setFetchSuccess("Game updated successfully")
            navigate('/Games')
        }
    }


    console.log(game)
    console.log(fetchError)

    return (

        <div className="card w-full bg-base-100 shadow-xl">
            <h5 className="card-title">
                Edit Game
            </h5>
            <br />
            <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} />
            <br />
            <form id="form1" onSubmit={handleSunmit} className="flex flex-col gap-4">
                {/* <form id="form1" onSubmit={() => window.confirm("Confirm create Publisher") && handleSunmit} className="flex flex-col gap-4"> */}
                <div className="form-control">



                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="searchtext">Publisher Name</label>
                    <input className="input input-bordered input-primary w-full"
                        type="text"
                        placeholder="Search.."
                        id="searchtext"
                        name="searchtext"
                        onChange={(e) => { setSearchText(e.target.value); }} />

                    <select className="select select-primary w-full" id="id_publisher" name='id_publisher' required={true} onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })}>

                        <option value={game.id_publisher}>{game.publisher?.name}</option>
                        <optgroup label="Publisher">
                            {publisherlist.map((publisher) =>
                                <option key={publisher.id_publisher} value={publisher.id_publisher}>{publisher.name}</option>
                            )}
                        </optgroup>
                    </select>

                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Game ID</label>
                    <input className="input input-bordered input-primary w-full"
                        id="id_game"
                        name='id_game'
                        type="number"
                        value={game.id_game}
                        disabled />

                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="img-url">Box Art</label>
                    <input className="input input-bordered input-primary w-full"
                        id="img_url"
                        name='img_url'
                        type="text"
                        value={game.img_url}
                        onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="name">Name</label>
                    <input className="input input-bordered input-primary w-full"
                        id="name"
                        name='name'
                        type="text"
                        value={game.name}
                        onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Genre</label>
                    <input className="input input-bordered input-primary w-full"
                        id="genre"
                        name='genre'
                        type="text"
                        value={game.genre}
                        onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="country">Platform</label>
                    <input className="input input-bordered input-primary w-full"
                        id="platform"
                        name='platform'
                        type="text"
                        value={game.platform}
                        onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="year">Year</label>
                    <input className="input input-bordered input-primary w-full"
                        id="release_year"
                        name='release_year'
                        type="number"
                        value={game.release_year}
                        onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })} />
                    <label className="label-text pb-3 pl-2 pt-3 text-left font-medium dark:text-black" htmlFor="state">Choose State</label>
                    <select className="select select-primary w-full" id="state" name='state' onChange={(e) => setGame({ ...game, [e.target.name]: e.target.value })}>
                        <option value={game.state}>{game.state}</option>
                        <optgroup label="State">
                            <option value={"enabled"}>Enabled</option>
                            <option value={"disabled"}>Disabled</option>
                        </optgroup>
                    </select>
                    <br />
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="btn btn-outline btn-primary" onClick={() => navigate('/Games')}>Back</button>
                        <button className="btn btn-outline btn-primary" type="submit">Submit</button>
                    </div>
                </div>
            </form>

        </div>

    )
}