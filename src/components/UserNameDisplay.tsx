export function UserNameDisplay(props: { username?: string; launchModal: () => void; disabled: boolean; }) {
  const { username } = props;
  return <button
    style={{
      marginTop: "2vh",
      marginBottom: "2vh",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textWrap: "nowrap",
      color: "inherit",
      width: "100%",
      fontStyle: username === undefined || username === '' ? "italic" : "normal"
    }}
    disabled={props.disabled}
    onClick={() => {
      if (!props.disabled) props.launchModal();
    }}
  >
    {username !== undefined && username !== "" ? username : "Click Here!"}
  </button>;
}
