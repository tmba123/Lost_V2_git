import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { LostContextList } from "./LostGamesContext";



export const searchGames = (searchOption: string, searchText: string, state: string, page: number) => {

    const { setFetchError } = useContext(AppContext);
    const [searchAll, setSearchAll] = useState<LostContextList>([])
  
  
    useEffect(() => {

        if ((!searchOption && !searchText) || (searchOption && !searchText)) {

            console.log("ENTROU Games GET ALL")
    
            const getAll = async () => {
    
    
              let query = supabase
    
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
                .match(state ? { "state": state } : {}) //If true filter by state otherwise empty object matches all rows
                .order("id_game", { ascending: false })
    
              if (page != 0) {
                query = query.range((page - 1) * 4, page * 4);
              }
    
    
              const { data, error } = await query
    
    
              if (error) {
                setFetchError(error.message)
                setSearchAll(searchAll.splice(0, searchAll.length)) //clear array em caso de erro – ".splice" evita problemas se o array for usado como referência para outra variável, como acontece com o método array = [] que cria um novo array
    
              }
              if (data) {
                setSearchAll(data as LostContextList)
                setFetchError("") //clear error em caso de sucesso
    
              }
            }
            getAll()
    
          } else {
            console.log("ENTROU Games Search")
            const getAll = async () => {
    
              let query = supabase
    
                .from('game')
                .select(
                   `id_game,
                    id_publisher,
                    publisher!inner(name),
                    img_url,name,
                    genre,
                    platform,
                    release_year,
                    state
                    `)
                .filter(searchOption,
                  (searchOption == "id_publisher" || searchOption == "year" || searchOption == "id_game") ? "gte" : "ilike",
                  (searchOption == "id_publisher" || searchOption == "year" || searchOption == "id_game") ? searchText : `%${searchText}%`)
                .match(state ? { "state": state } : {}) //If true filter by state otherwise empty object matches all rows
                .order("id_game", { ascending: false })
    
              if (page != 0) {
                query = query.range((page - 1) * 4, page * 4);
              }
    
              const { data, error } = await query
    
    
              if (error) {
                setFetchError(error.message)
                setSearchAll(searchAll.splice(0, searchAll.length)) //clear array em caso de erro – ".splice" evita problemas se o array for usado como referência para outra variável, como acontece com o método array = [] que cria um novo array
                console.log(error)
              }
              if (data) {
                setSearchAll(data as LostContextList)
                setFetchError("") //clear error em caso de sucesso
    
              }
            }
            getAll()
    
          }
    
    }, [searchOption, searchText, page, state])

        return [searchAll]
}