import style from './button.module.css'

interface buttonProps {
    className?: string,
    children: any,
    onClick?: () => void
}
export default function Button(props: buttonProps) {
    return (
        <button className={`${style.button} ${props.className} `}
            onClick={props.onClick}
        >{props.children}</button>
    )
}