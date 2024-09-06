import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListResponse, ListResponseEntry, Malformed, ShoppingListItem, parseItemListResponse } from "../responseValidation/parseItemList";
import { RootState } from "./store";

export type Profile = {
    showPurchased: boolean,
    username?: string
}

export type SliceType = {
    entries: ListResponseEntry[],
    apiLocation: string,
    profile: Profile
}
const initialPreferences: SliceType = {
    entries: [],
    apiLocation: "https://to9p3voktf.execute-api.us-east-2.amazonaws.com/ShoppingTest",
    profile: {showPurchased: true}
}

function filterData(itemId: number) : ((v: ListResponseEntry) => boolean ) {
    return (data) => !(data !== null && "itemId" in data && data.itemId === itemId)
}

export const setUsername = createAsyncThunk(
    'remoteData/getEntries',
    async (username: string | undefined, {getState, rejectWithValue}) => {
        const {remoteData: {apiLocation, profile: {username: stateUsername}}} = getState() as RootState;
        try {
            const query = `${apiLocation}/get-list?user-name=${username === undefined ? stateUsername : username}`
            const resp = await axios.get(query);
            return parseItemListResponse(resp.data.body);
        } catch (e) {
            return rejectWithValue(e)
        }

    }
)

export const submitEntry = createAsyncThunk(
    // The name of the action
    'remoteData/submitEntry',
    // The payload creator
    async (args: {itemName: string}, {getState, rejectWithValue}) => {
      const {remoteData} = getState() as RootState;
      if (remoteData.profile.username === undefined) return rejectWithValue({err: "No username currently set."});
      if ( args.itemName.length < 1) return rejectWithValue({err: "No value provided for item name."})
      try {
        const body = { 'user-name': remoteData.profile.username, 'item': args.itemName };
        const resp = await axios.post(`${remoteData.apiLocation}/add-item`, body);
        const parse = JSON.parse(resp.data.body);
        if (typeof parse === "object" && "insertId" in parse) {
            return { item: args.itemName, itemId: parse.insertId, dateCreated: Date.now(), dateFetched: Date.now(), purchased: false } as ShoppingListItem;
        } else {
            return rejectWithValue({err: "Item failed to be created."});
        }
      } catch (err) {
        return rejectWithValue(err)
      }
    }
  )

export const deleteEntry = createAsyncThunk(
    // The name of the action
    'remoteData/deleteEntry',
    // The payload creator
    async (args: {itemId: number}, {getState, rejectWithValue}) => {
      const {remoteData} = getState() as RootState;
      if (remoteData.profile.username === undefined) return rejectWithValue({err: "No username currently set."});
      try {
        await axios.delete(
            `${remoteData.apiLocation}/delete-item?user-name=${remoteData.profile.username}&item-id=${args.itemId}`);
        return args.itemId
      } catch (err) {
        return rejectWithValue(err)
      }
    }
  )

export const markPurchased = createAsyncThunk(
    "remoteData/markPurchased",
    async (itemId: number, {getState, rejectWithValue}) => {
        const {remoteData: {profile: {username}, apiLocation}} = getState() as RootState;
        const body = { "user-name": username, "item-id": itemId, purchased: true };
        try {
            await axios.patch(`${apiLocation}/mark-purchased`, body);
            return itemId
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const markUnpurchased = createAsyncThunk(
    "remoteData/markUnpurchased",
    async (itemId: number, {getState, rejectWithValue}) => {
        const {remoteData: {profile: {username}, apiLocation}} = getState() as RootState;
        const body = { "user-name": username, "item-id": itemId, purchased: false };
        try {
            await axios.patch(`${apiLocation}/mark-purchased`, body);
            return itemId
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const updatePreferences = createAsyncThunk(
    "remoteData/updatePreferences",
    async (profile: Profile, {getState, rejectWithValue}) => {
        const {remoteData: {apiLocation}} = getState() as RootState;
        if (profile.username === undefined) return rejectWithValue({error: "No username provided."})
        const body = { "user-name": profile.username as string, "show-purchased": profile.showPurchased as boolean}
        
        try {
            await axios.patch(`${apiLocation}/update-preference`, body)
            return profile
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const remoteDataSlice = createSlice({
    name: "remoteData",
    initialState: initialPreferences,
    reducers: {
        filterByID: (state, action: PayloadAction<number>) => {
            state.entries = state.entries.filter(filterData(action.payload))
            return state
        },
        clearUsername: (state) => {
            state.entries = []
            state.profile.username = undefined
            return state
        }
    },
    extraReducers: (builder) => {
        builder.addCase(submitEntry.fulfilled, (state: SliceType, action: PayloadAction<ShoppingListItem>) => {
            state.entries.push(action.payload);
            return state;
        })
        .addCase(deleteEntry.fulfilled, (state: SliceType, action: PayloadAction<number>) => {
            state.entries = state.entries.map(
                (v) => v?.itemId === action.payload 
                    ? {...v, deleting: true}
                    : v
                )
            return state;
        })
        .addCase(updatePreferences.fulfilled, (state: SliceType, action: PayloadAction<Profile>) => {
            state.profile.showPurchased = action.payload.showPurchased
            state.profile.username = action.payload.username
            return state
        })
        .addCase(setUsername.fulfilled, (state: SliceType, action: PayloadAction<ListResponse>) => {
            state.entries = action.payload.entries
            if (action.payload.preferences !== null) {
                state.profile = action.payload.preferences
            }
            return state
        })
        .addCase(markPurchased.fulfilled, (state: SliceType, action: PayloadAction<number>) => {
            const matchesId = (val: ListResponseEntry) : val is (ShoppingListItem | Malformed) => !filterData(action.payload)(val)
            state.entries = state.entries.map((v) => matchesId(v) ? {...v, purchased: true} : v)
            return state
        })
        .addCase(markUnpurchased.fulfilled, (state: SliceType, action: PayloadAction<number>) => {
            const matchesId = (val: ListResponseEntry) : val is (ShoppingListItem | Malformed) => !filterData(action.payload)(val)
            state.entries = state.entries.map((v) => matchesId(v) ? {...v, purchased: false} : v)
            return state
        })
    }
});

export default remoteDataSlice.reducer;
export const {filterByID, clearUsername} = remoteDataSlice.actions;
