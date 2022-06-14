interface tableProps {
    children: any
    className?: string,
    IDOfTbody?: string
}
import styles from './table.module.css'
export default function Table(props: tableProps) {
    return (
        <table className={`${props.className} ${styles.table}`}>

            <thead className={styles.thead}>
                {props.children[0]}
            </thead>
            <tbody className={styles.tbody} id={props.IDOfTbody}>
                {props.children[1]}
            </tbody>

        </table>
    )
}