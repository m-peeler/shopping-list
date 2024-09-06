import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useState } from "react";

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

export function CustomCheckbox(props: {name: string, checked: boolean, onChange: (val: boolean) => void, display?: string, ariaLabel: string, accentColor?: string, style?: CSSProperties | undefined}) {
    const [hover, setHover] = useState<boolean>(false);

    const checkboxStyle = {
        color: hover 
            ? props.accentColor ? props.accentColor : "var(--accent-400)" 
            : "inherit", 
        transition: "color 200ms",
        
    };
    return (<>

        <label style={{
            alignSelf: "center", 
            flexDirection: "row", 
            transition: "color 0.5s",
            ...props.style
        }} htmlFor={`checkbox-${props.name}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <input 
                type="checkbox" 
                id={`checkbox-${props.name}`}
                checked={props.checked} 
                onChange={() => props.onChange(!props.checked)} 
                style={{display: "none"}}
                aria-label={props.ariaLabel}
            />
            <span style={{textWrap: "wrap", marginRight: "0.6em"}}>{props.display}</span>
            {props.checked
                ? <FontAwesomeIcon icon={faCircleCheck} style={checkboxStyle}/>
                : <FontAwesomeIcon icon={faCircle}  style={checkboxStyle}/>
            }
        </label>
    </>
    )


}