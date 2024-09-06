import { Profile } from "../reduxState/entriesSlice"

  export type ShoppingListItem = {
    item: string, 
    itemId: number,
    purchased: boolean
    dateFetched: number,
    dateCreated: number,
    datePurchased?: number,
    deleting?: boolean
  }
  
  export type Malformed = {
    item?: string,
    itemId?: number,
    purchased?: boolean
    dateCreated?: number,
    datePurchased?: number,
    dateFetched: number
  }
  
  export type Dud = null;
  
  interface hasItem {
    item: string
  }
  
  function validateItem(val: object) : val is hasItem {
    return "item" in val && typeof val.item == "string"
  }
  
  interface hasDateAdded {
    dateAdded: string
  }
  
  function validateDateAdded(val: object) : val is hasDateAdded {
    return "dateAdded" in val && typeof val.dateAdded == "string"
  }
  
  interface hasPurchased {
    purchased: number
  }
  
  function validatePurchased(val: object) : val is hasPurchased {
    return "dateAdded" in val && typeof val.dateAdded == "string"
  }
  
  interface hasPurchaseDate {
    purchaseDate: string
  }
  
  function validatePurchaseDate(val: object) : val is hasPurchaseDate {
    return "purchaseDate" in val && typeof val.purchaseDate == "string";
  }
  
  interface hasIdEntries {
    idEntries: number
  }
  
  function validateIdEntries(val: object) : val is hasIdEntries {
    return "idEntries" in val && typeof val.idEntries == "number";
  }

  export type ListResponseEntry = ShoppingListItem | Malformed | Dud;

  export function isShoppingListItem(item: ListResponseEntry) : item is ShoppingListItem {
    return item !== null && item.dateCreated !== undefined && item.item !== undefined && item.purchased !== undefined
  }
  
  export function parseItemList(dataResponse: unknown[]) : ListResponseEntry[] {
    return dataResponse.map((val) => {
      if (val instanceof Object
        && validateItem(val)
        && validateDateAdded(val)
        && validatePurchased(val)
        && validateIdEntries(val)
      ) 
      {
        return {
          item:           val.item,
          dateCreated:    Date.parse(val.dateAdded),
          purchased:      val.purchased == 1,
          datePurchased:  validatePurchaseDate(val) ? Date.parse(val.purchaseDate) : undefined,
          itemId:         val.idEntries,
          dateFetched:    Date.now()
        } as ShoppingListItem
      } else if (val instanceof Object) {
        return {
          item:           validateItem(val) ? val.item : undefined,
          purchased:      validatePurchased(val) ? val.purchased == 1 : undefined,
          itemId:         validateIdEntries(val) ? val.idEntries : undefined,
          dateCreated:    validateDateAdded(val) ? Date.parse(val.dateAdded) : undefined,
          datePurchased:  validatePurchaseDate(val) ? Date.parse(val.purchaseDate) : undefined,
          dateFetched:    Date.now()
        } as Malformed
      } 
      return null as Dud;
    })
  }

  export function parsePreferences(dataResponse: unknown) : (Profile | null) {
    if (dataResponse !== null 
        && typeof dataResponse === "object" 
        && "showPurchased" in dataResponse
    ) {
        const showPurchased = typeof dataResponse.showPurchased === "boolean"
          ? dataResponse.showPurchased
          : typeof dataResponse.showPurchased === "number" 
            ? dataResponse.showPurchased > 0 ? true : false
            : false;
        let username;
        if ("userName" in dataResponse && typeof dataResponse.userName === "string") 
          {
            username = dataResponse.userName
          }
        return { showPurchased , username }
    } else {
        return null
    }
  }

  export type ListResponse = { 
    preferences: (Profile | null),
    entries: ListResponseEntry[]
  }

  export function parseItemListResponse(dataResponse: unknown) : ListResponse {
    if (dataResponse === null || typeof dataResponse !== "object") {
        return {
            preferences: null,
            entries: []
        }
    }
    return {
        preferences : 
            "preferences" in dataResponse 
            && typeof dataResponse.preferences === "string"
                ? parsePreferences(JSON.parse(dataResponse.preferences)[0])
                : null,
        entries: "entries" in dataResponse
            && typeof dataResponse.entries === "string"
                ? parseItemList(JSON.parse(dataResponse.entries))
                : []
    }
  }