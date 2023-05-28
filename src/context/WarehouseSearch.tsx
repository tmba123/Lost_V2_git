import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { LostContextList } from "./LostGamesContext"



export const searchWarehouse = (searchOption: string, searchText: string, state: string, page: number) => {

  const { setFetchError } = useContext(AppContext) //Set error messages
  const [searchAll, setSearchAll] = useState<LostContextList>([]) //Warehouse List

  useEffect(() => {

    if ((!searchOption && !searchText) || (searchOption && !searchText)) {  //Filter all by state and with or without pagination

      const getAll = async () => {


        let query = supabase
          .from('warehouse')
          .select("*")
          .match(state ? { "state": state } : {}) //If true filter by state otherwise empty object matches all rows
          .order("id_warehouse", { ascending: false })

        if (page != 0) {
          query = query.range((page - 1) * 4, page * 4)
        }



        const { data, error } = await query


        if (error) {
          setFetchError("Something Went Wrong, Please Try Again.")
          setSearchAll(searchAll.splice(0, searchAll.length)) //clear array em caso de erro – ".splice" evita problemas se o array for usado como referência para outra variável, como acontece com o método array = [] que cria um novo array

        }
        if (data) {
          setSearchAll(data as LostContextList)
          setFetchError("") //clear error em caso de sucesso

        }
      }
      getAll()

    } else { //Filter if searchOption and searchText true, by state and with or without pagination

      const getAll = async () => {

        let query = supabase
          .from('warehouse')
          .select("*")
          .filter(searchOption, // gte if number, ilike if string
            (searchOption == "id_warehouse") ? "gte" : "ilike",
            (searchOption == "id_warehouse") ? searchText : `%${searchText}%`)
          .match(state ? { "state": state } : {}) //If true filter by state otherwise empty object matches all rows
          .order("id_warehouse", { ascending: false })


        if (page != 0) {
          query = query.range((page - 1) * 4, page * 4)
        }

        const { data, error } = await query


        if (error) {
          setFetchError("Something Went Wrong, Please Try Again.")
          setSearchAll(searchAll.splice(0, searchAll.length)) //clear array em caso de erro – ".splice" evita problemas se o array for usado como referência para outra variável, como acontece com o método array = [] que cria um novo array
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