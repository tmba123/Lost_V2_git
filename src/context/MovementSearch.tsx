import { supabase } from '../lib/supabase'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from './AppContext'
import { LostContextList } from "./LostGamesContext"



export const searchMovements = (searchGame: string, searchWarehouse: string, searchMovementType: string, page: number) => {

  const { setFetchError } = useContext(AppContext) //Set error messages
  const [searchAll, setSearchAll] = useState<LostContextList>([]) //Movement List


  useEffect(() => {

    if (!searchGame && !searchWarehouse && !searchMovementType) { //Filter all with or without pagination

      const getAll = async () => {


        let query = supabase
          //Join Game && Warehouse table´s FK id_game, id_warehouse to get game name && warehouse location
          .from('movement')
          .select(`
                id_movement,
                id_game,
                game (name),
                id_warehouse,
                warehouse (location),
                movement_type,
                quantity,
                movement_date
                `)
          .order("id_movement", { ascending: false })

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

    } else {

      const getAll = async () => {

        let query = supabase
          //Join Game && Warehouse table´s FK id_game, id_warehouse to get game name && warehouse location
          .from('movement')
          .select(`
                id_movement,
                id_game,
                game (name),
                id_warehouse,
                warehouse (location),
                movement_type,
                quantity,
                movement_date
                `)
          .match(searchGame ? { "id_game": searchGame } : {}) //If true filter by id_game otherwise empty object matches all rows
          .match(searchWarehouse ? { "id_warehouse": searchWarehouse } : {}) //If true filter by id_warehouse otherwise empty object matches all rows
          .match(searchMovementType ? { "movement_type": searchMovementType } : {}) //If true filter by movement_type otherwise empty object matches all rows

          .order("id_movement", { ascending: false })

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


  }, [searchGame, searchWarehouse, searchMovementType, page])

  return [searchAll]
}