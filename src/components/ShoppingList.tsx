import { useCallback, useState } from 'react';
import { ShoppingListEntry } from './ShoppingListEntry.tsx';
import { ShoppingListEntryInput } from './ShoppingListEntryInput.tsx';
import { useAppDispatch, useAppSelector } from '../reduxState/reduxHooks.ts';
import { isShoppingListItem } from '../responseValidation/parseItemList.ts';
import { deleteEntry, submitEntry } from '../reduxState/entriesSlice.ts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function ShoppingList() {
  const {showPurchased, username} = useAppSelector((state) => state.remoteData.profile);
  const data = useAppSelector((state) => state.remoteData.entries)
  const [newItem, setNewItem] = useState<string>("");
  const dispatch = useAppDispatch()

  const deleteItem = useCallback(
    (itemId: number) => dispatch(deleteEntry({ itemId: Number(itemId) }))
  , [dispatch])

  const submitInput = useCallback(
    (s: string) => {
      dispatch(submitEntry({ itemName: String(s) }))
      setNewItem('')
    }
  , [dispatch, setNewItem])

  return (
    <div className="card">
      {username === undefined || data === undefined
        ? <h2>
            Let's make a new list!
          </h2>
        : <>
          <ShoppingListEntryInput
              key="input"
              setInput={setNewItem}
              inputValue={newItem}
              submitInput={submitInput} 
          />
          {data.filter(isShoppingListItem)
          .map((v) => {
            return <>
            <hr hidden={(v.purchased && showPurchased) || (v.deleting)} style={{borderColor: "var(--primary-500)", padding: 0, margin: 0}} />
            <ShoppingListEntry
              key={v.itemId}
              animateIn={Date.now() - v.dateFetched < 1000}
              item={v.item}
              itemId={v.itemId}
              purchased={v.purchased}
              visible={!(v.purchased && showPurchased) && !(v.deleting)}
              deleteItem={deleteItem} 
            />
          </>
          }
          
          )}
        </>}
    </div>
  );
}

