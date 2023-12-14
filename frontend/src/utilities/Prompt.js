/**
 * Displays text input with given params for Review Filters
 */
const Prompt = ({prompt, value, handleChange}) => {
    const onChange = e => {
        const { value } = e.target
        handleChange(prompt, value, e)
    }
    
    return (
        <>
            <input placeholder={prompt ==="username" ? `Review Owner` : `Book ${prompt}`}
                    value={value || ""}
                    onChange={onChange}
            />
        </>
    )
}

export default Prompt