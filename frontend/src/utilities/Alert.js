/** 
 *Presentational component for showing alerts.
 **/
const Alert = ({ type="danger", messages=[] }) => {
    return (
        <div className={`Alert, Alert-${type}`}>
            {messages.map(errorMessage =>(
                <p key={errorMessage}>{errorMessage}</p>
            ))}
        </div>
    )
}

export default Alert;