import { supabase } from '../lib/supabase';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export type PublisherType = {
  id_publisher?: number
  img_url: string
  name: string
  country: string
  year: number
  state: string
}

export type GameType = {
  id_game?: number
  id_publisher: number
  publisher_name: string
  img_url: string
  name: string
  genre: string
  platform: string
  release_year: number
  state: string
}

export type WarehouseType = {
  id_warehouse?: number
  location: string
  state: string
}


export type InventoryType = {
  id_game?: number
  game_name: string
  id_warehouse: number
  warehouse_location: string
  quantity: number
  img_url: string
}

export type MovementType = {
  id_movement?: number
  id_game: number
  game_name: string
  id_warehouse: number
  warehouse_location: string
  movement_type: string
  movement_date: Date
}



export type LostContextList = PublisherType[] | GameType[] | WarehouseType[] | InventoryType[] | MovementType[];

export const searchLostGames = (table: string, searchOption: string, searchText: string, state: string, page: number) => {

  const { setFetchError } = useContext(AppContext);
  //const [orderby, setOrderBy] = useState("")
  //Condição dos If´s “if (table == "publisher"){ setOrderBy("id_publisher")}”
  //não está a funcionar “orderby” fica inalterado “”
  let orderby = ""
  const [searchAll, setSearchAll] = useState<LostContextList>([])

  //console.log(state)

  useEffect(() => {

    if (table == "publisher"){orderby = "id_publisher"}
    if (table == "game") {orderby = "id_game"}
    if (table == "warehouse") {orderby = "id_warehouse"}
    if (table == "inventory") {orderby = "id_game"}
    if (table == "movement") {orderby = "id_movement"}



    if (!searchOption && !searchText) {

      console.log("entrou get all")


      const getAll = async () => {
        const { data, error} = await supabase
          .from(table)
          .select("*", { count: 'exact' })
          .order(orderby, { ascending: false })
          .range((page - 1) * 4, page * 4)

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
      console.log("entrou search")
      const getAll = async () => {

        const { data, error} = await supabase

          .from(table)
          .select("*", { count: 'exact' })
          .filter(searchOption,
            (searchOption == "id_publisher" || searchOption == "year") ? "gte" : "ilike",
            (searchOption == "id_publisher" || searchOption == "year") ? searchText : `%${searchText}%`)
          .order(orderby, { ascending: false })
          .range((page - 1) * 4, page * 4)

        if (error) {
          setFetchError(error.message)
          setSearchAll(searchAll.splice(0, searchAll.length)) //clear array em caso de erro – ".splice" evita problemas se o array for usado como referência para outra variável, como acontece com o método array = [] que cria um novo array
          console.log(error)
        }
        if (data) {
          setSearchAll(data as PublisherType[])
          setFetchError("") //clear error em caso de sucesso

        }
      }
      getAll()

    }

  }, [searchOption, searchText, page])

  return [searchAll]
}
