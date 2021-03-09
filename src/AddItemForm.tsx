import React, {useState, KeyboardEvent, ChangeEvent} from 'react';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    // const [error, setError] = useState<string | null>(null)

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }
    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addItem()
        }
    }
    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
        } else {
            setError(true)
            // setError('Title is required!')
        }
        setTitle('')
    }
    return (
        <div>
            <input
                className={error ? 'error' : ''}
                value={title}
                onChange={changeTitle}
                onKeyPress={onKeyPressAddItem}
            />

            <button onClick={addItem}>Add</button>
            {error && <div className={'errorMessage'}>'Title is required!'</div>} {/*{error}*/}
        </div>
    )
}