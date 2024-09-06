import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomTextInput } from './CustomTextInput.tsx';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

type TakeNewInputProps = {
  setInput: (s: string) => void;
  inputValue: string;
  submitInput: (s: string) => void;
  visible?: boolean;
};

export function ShoppingListEntryInput(props: TakeNewInputProps) {
  return <div className="list-item">
    <CustomTextInput
      placeholder='New Item'
      value={props.inputValue}
      setValue={props.setInput}
      onSubmit={props.submitInput} />
    <button aria-label={`Add Entry`} style={{ width: "60px" }} value="Add" color="blue" onClick={() => props.submitInput(props.inputValue)}>
      <FontAwesomeIcon icon={faPlus} />
    </button>
  </div>;
}
