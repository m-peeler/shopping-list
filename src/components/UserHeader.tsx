import { CustomCheckbox } from "./CustomCheckbox.tsx";
import { useAppDispatch, useAppSelector } from '../reduxState/reduxHooks.ts';
import { updatePreferences } from '../reduxState/entriesSlice.ts';
import { UserNameDisplay } from './UserNameDisplay.tsx';

export function UserHeader(props: { modalOpened: boolean; launchModal: () => void; }) {
  const { showPurchased: showingPurchased, username } = useAppSelector((state) => {
    return state.remoteData.profile;
  });
  const dispatch = useAppDispatch();

  return (
    <div className="user-header">
      <UserNameDisplay disabled={props.modalOpened} username={username} launchModal={props.launchModal} />
      <CustomCheckbox 
        style={{
          backgroundColor: "var(--secondary-500)", 
          padding: 10,
          marginTop: "2vh",
          marginBottom: "2vh",
          borderRadius: "10px",
          alignItems: "center",
          width: "100%"
        }} 
        accentColor={"var(--accent-700)"} 
        ariaLabel="Hide all marked entries" 
        display="Hide Marked Items" 
        name="toggle-checkmark" 
        checked={showingPurchased}
        onChange={(val) => dispatch(updatePreferences({showPurchased: val, username: username}))} 
      />
    </div>
  );
}
