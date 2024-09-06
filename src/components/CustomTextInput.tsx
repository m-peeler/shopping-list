export function CustomTextInput(props: {autoFocus?: boolean, onSubmit: (s: string) => void, value: string, setValue: (s: string) => void, placeholder: string, }) {
    return (
        <input
            autoFocus={props.autoFocus}
            onChange={(event) => {
              props.setValue(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                props.onSubmit(props.value)
              }
            }}
            placeholder={props.placeholder}
            type="text"
            value={props.value} 
            style={{
              flexShrink: 1, 
              flex: 1, 
              borderRadius: 3,
              width: "100%",
              marginRight: "5%", 
              backgroundColor: "var(--accent-700)", 
              fontSize: 15,
              fontWeight: 400,
              WebkitFontSmoothing: "antialiasing",
              borderColor: "var(--secondary-800)", 
              color: "var(--text-50)", 
              borderStyle: "solid"
            }}
          />
    )
}

