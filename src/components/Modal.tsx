import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons/faXmarkCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react';

export function Modal(props: { 
  openModal: boolean; 
  closeModal: () => void; 
  children: string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | null | undefined; 
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [hover, setHover] = useState<boolean>(false);
  useEffect(() => {
    if (props.openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  });

  return <>
    <dialog className='modal' ref={ref} style={{backgroundColor: "var(--secondary-400)", overflow: "hidden"}}>
      <label 
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)} 
        style={{transition: "color 0.5s", position: "relative", right: "-50%", top: "-10px", color: hover ? "var(--accent-600)" : "var(--text-800)"}}
      >
        <input type="button" onClick={() => {props.closeModal()}} style={{height: 0, width: 0, backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, borderBlock: 0, margin: 0, padding: 0}} />
        <FontAwesomeIcon icon={faXmarkCircle} />
      </label>
      {props.children}
    </dialog>
  </>;
}
