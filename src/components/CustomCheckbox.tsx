import { CSSProperties, useState } from "react";
import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function CustomCheckbox(props: { name: string; checked: boolean; onChange: (val: boolean) => void; display?: string; ariaLabel: string; accentColor?: string; style?: CSSProperties | undefined; }) {
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
                style={{ display: "none" }}
                aria-label={props.ariaLabel} />
            <span style={{ textWrap: "wrap", marginRight: "0.6em" }}>{props.display}</span>
            {props.checked
                ? <FontAwesomeIcon icon={faCircleCheck} style={checkboxStyle} />
                : <FontAwesomeIcon icon={faCircle} style={checkboxStyle} />}
        </label>
    </>
    );
}
