
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
  publisher?: { name: string }
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
  id_game: number
  game?: { name: string, img_url: string }
  id_warehouse: number
  warehouse?: {location: string}
  quantity: number
}

export type MovementType = {
  id_movement?: number
  id_game: number
  game?: {name: string}
  id_warehouse: number
  warehouse?: {location: string}
  movement_type: string
  quantity: number
  movement_date?: Date
}



export type LostContextList = PublisherType[] | GameType[] | WarehouseType[] | InventoryType[] | MovementType[];
