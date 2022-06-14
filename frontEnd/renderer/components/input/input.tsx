import React from "react";
import styles from './input.module.css'
interface inputPros {
    type: string,
    id?: string,
    name?:string,
    size?: number,
    placeHolder?: any,
    className?: string,
    label: string,
    value: any,
    onChange: (e) => void,
    onClick?: () => void,
    onKeyDown?:(e) => void
    
}
export default function Input(props: inputPros) {
    
    return (
        <React.Fragment>
            <label
                className={styles.inputLabel}
                htmlFor={props.id}>
                {props.label}
            </label>

            <input
                type={props.type}
                id={props.id}
                name={props.name}
                size={props.size}
                placeholder={props.placeHolder}
                className={`${props.className} ${styles.input}`}
                value={props.value}
                onChange={props.onChange}
                onClick={props.onClick}
                
            />
        </React.Fragment>
    )
}