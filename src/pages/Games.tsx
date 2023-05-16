import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';


//Components
import { PublisherType, GameType } from "../context/LostGamesContext";



export function Games(){


    const [fetchError, setFetchError] = useState("")
    const [searchOption, setSearchOption] = useState("");
    const [searchText, setSearchText] = useState("");

    return <h1>Games</h1>
}