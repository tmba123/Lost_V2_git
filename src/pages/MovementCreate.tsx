import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


//Components
import { ErrorAlert } from '../components/Alerts';
import { AppContext } from '../context/AppContext';
import { Add_stock } from '../components/Add_stock';
import { Remove_stock } from '../components/Remove_stock';
import { In_transit } from '../components/In_transit';



export const MovementCreate = () => {


    const navigate = useNavigate()

    const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext); //Set success/error messages
    const [movementType, setMovementType] = useState("") //Used to call the correct component based on the Movement Type selected, by the user


    useEffect(() => {


    }, [movementType]);


    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lost Videogames - New Movement</title>
            </Helmet>
            <div>

                <div className="card w-full bg-base-100 shadow-xl">
                    <h5 className="card-title">
                        New Movement
                    </h5>
                    <br />
                    <form className="flex flex-col gap-4">
                        <div>
                            <select aria-label="label for the select" className="select select-primary w-full" id="movementtype" name='movementtype' onChange={(e) => setMovementType(e.target.value)}>
                                <option value={""}>Choose Movement Type</option>
                                <optgroup label="Criteria">
                                    <option value="add_stock">Add Stock</option>
                                    <option value="remove_stock">Remove Stock</option>
                                    <option value="in_transit">In Transit</option>
                                </optgroup>
                            </select>
                        </div>
                        <ErrorAlert fetchError={fetchError} setFetchError={setFetchError} fetchSuccess={fetchSuccess} setFetchSuccess={setFetchSuccess} />
                    </form>
                    <br />
                    {movementType == "add_stock" ? (

                        <Add_stock />


                    ) : null}

                    {movementType == "remove_stock" ? (

                        <Remove_stock />


                    ) : null}

                    {movementType == "in_transit" ? (

                        <In_transit />


                    ) : null}

                    <br />
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="btn btn-outline btn-primary btn-sm" onClick={() => navigate('/Movement', { replace: true })}>Back</button>
                    </div>
                </div>
            </div>
        </HelmetProvider>

    )
}
