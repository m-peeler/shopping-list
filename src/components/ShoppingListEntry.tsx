import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { CustomCheckbox } from "./CustomCheckbox.tsx";
import { useCallback } from 'react';
import { useAppDispatch } from '../reduxState/reduxHooks.ts';
import { filterByID, markPurchased, markUnpurchased } from '../reduxState/entriesSlice.ts';

type RenderItemProps = {
  item: string;
  itemId: number;
  purchased: boolean;
  animateIn: boolean;
  deleting?: boolean;
  deleteItem: (itemId: number) => void;
  visible?: boolean;
};

export function ShoppingListEntry(props: RenderItemProps) {

  const visible: boolean = props.visible === undefined ? true : props.visible;
  const dispatch = useAppDispatch();

  const mark = useCallback(
    (status: boolean) => status ? dispatch(markPurchased(props.itemId)) : dispatch(markUnpurchased(props.itemId))
  , [props, dispatch])

  const deleted = useCallback(() => {
    props.deleteItem(props.itemId)
    setTimeout(() => dispatch(filterByID(props.itemId)), 600)
  }, [dispatch, props])

  return <div 
    className={`list-item ${props.animateIn ? "animate-in" : ""}`}
    style={{
      ...(visible 
        ? {
          visibility: "visible",
          marginTop: ".2em",
          marginBottom: ".2em",
          opacity: 1,
        }
        : {
          visibility: "hidden",
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          opacity: 0,
        }
      )
    }} >
      <label style={{display: "flex", textAlign: "left", visibility: "inherit"}}>
        <CustomCheckbox 
          name={`list-item-${props.itemId}`} 
          checked={props.purchased} 
          onChange={mark}
          ariaLabel={`Mark ${props.item}`}
        />
        <span style={{marginLeft: "0.4em"}}>{props.item}</span>
      </label>
      <button aria-label={`Delete ${props.item}`} style={{width: "60px", justifySelf: "flex-end", visibility: "inherit"}} onClick={deleted}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>;
}
