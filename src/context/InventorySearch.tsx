import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { LostContextList } from "./LostGamesContext"



export const searchInventory = (searchGame: string, searchWarehouse: string, location: string, page: number) => {

  const { setFetchError } = useContext(AppContext) //Set error messages
  const [searchAll, setSearchAll] = useState<LostContextList>([]) //Inventory List


  useEffect(() => {

    if (!searchGame && !searchWarehouse && !location) { //Filter all with or without pagination


      const getAll = async () => {


        let query = supabase
          //Join Game && Warehouse table´s FK id_game, id_warehouse to get game name, img_url && warehouse location
          .from('inventory')
          .select(`
                id_game,
                game (name, img_url),
                id_warehouse,
                warehouse (location),
                quantity
                `)
          .order("id_game", { ascending: false })

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

    } else { //Filter if any of searchGame, searchWarehouse or location are true, with or without pagination

      const getAll = async () => {

        let query = supabase
          //Join Game && Warehouse table´s FK id_game, id_warehouse to get game name, img_url && warehouse location
          .from('inventory')
          .select(`
                id_game,
                game (name, img_url),
                id_warehouse,
                warehouse!inner (location),
                quantity
                `)

          .match(searchGame ? { "id_game": searchGame } : {}) //If true filter by id_game otherwise empty object matches all rows
          .match(searchWarehouse ? { "id_warehouse": searchWarehouse } : {}) //If true filter by id_warehouse otherwise empty object matches all rows

        if (location == "Transit") { //Filter only Transit warehouse

          query = query.match(location ? { "warehouse.location": location } : {}) //If true filter by warehouse location otherwise empty object matches all rows   

        } else if (location == "RemoveStock") { // Filter all warehouses except Transit
          query = query.not("warehouse.location", "eq", "Transit") //If true filter by warehouse location otherwise empty object matches all rows   
        }
        query = query.order("id_game", { ascending: false })

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


  }, [searchGame, searchWarehouse, page])

  return [searchAll]
}