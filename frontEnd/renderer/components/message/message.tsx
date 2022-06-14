interface messageProps {
    visible: boolean,
    label: string,
    className?:string
}
import styles from './message.module.css'
export default function Message(props: messageProps) {
    let display
    if (props.visible) {
        display = 'displayFlex'
    } else {
        display = 'displayHidden'
    }
    return (
        <div className={` ${styles.message} ${props.className} ${display}`}>
            <p>{props.label}</p>
        </div>
    )

}