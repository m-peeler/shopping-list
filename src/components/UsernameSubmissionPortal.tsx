import { useState } from 'react';
import { CustomTextInput } from './CustomInput.tsx';
import { useAppDispatch } from '../reduxState/reduxHooks.ts';
import { clearUsername, setUsername } from '../reduxState/entriesSlice.ts';
import { useCookies } from 'react-cookie';

export function UsernameSubmissionPortal(props: { closeModal: () => void; }) {
  const [inputUserName, setInputUserName] = useState<string>('');
  const dispatch = useAppDispatch();
  const [, setCookies] = useCookies(["username"]);

  const closeModalAndSubmitUsername = () => {
    const newName = inputUserName === "" || inputUserName == undefined ? undefined : inputUserName;
    dispatch(newName !== undefined ? setUsername(newName) : clearUsername());
    setCookies("username", newName, { path: "/" });
    props.closeModal();
  };

  return (
    <div style={{ width: "clamp(200px, 30vw, 300px)" }}>
      <div style={{ paddingBottom: "10px", textWrap: "balance" }}>
        Pick a name for your list, or the
        name of a list you've used before.
      </div>
      <CustomTextInput autoFocus value={inputUserName} onSubmit={closeModalAndSubmitUsername} setValue={(s: string) => setInputUserName(s)} placeholder="Name" />
      <button onClick={closeModalAndSubmitUsername} style={{ marginTop: "2vh" }}>
        {"Submit"}
      </button>
    </div>
  );
}
