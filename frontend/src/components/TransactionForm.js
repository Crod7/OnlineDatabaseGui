import { useState } from "react"
import { useTransactionsContext } from "../hooks/useTransactionContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { generateDateId } from '../functions/GenerateDateId'


const TransactionForm = () => {
    const { dispatch } = useTransactionsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [withdraw, setWithdraw] = useState('')
    const [error, setError] = useState(null)

    const handleTransactionSubmit = async (e) =>{
        e.preventDefault()
        // Error handling, checks to see if logged in
        if (!user){
            setError('You must be logged in.')
            return
        }
        const dateId = generateDateId()
        const transaction = {title, withdraw, dateId}

        const response = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        // If the entry is invalid we display an error message
        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {                      // If th entry is valid we clear all the text fields and error messages
            setTitle('')
            setWithdraw('')
            setError(null)
            dispatch({type: 'CREATE_TRANSACTION', payload: json})
        }
    }

    return(
        <form className='create' onSubmit={handleTransactionSubmit}>
            <h3> Add a new Transaction</h3>

            <label>Transaction title:</label>
            <input
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                //className={emptyFields.includes('title') ? 'error' : ''}
            />
            
            <label>Amount:</label>
            <input
                type='number'
                onChange={(e) => setWithdraw(e.target.value)}
                value={withdraw}
                //className={emptyFields.includes('withdraw') ? 'error' : ''}
            />
            


            <button>Add</button>
            {error && <div className = "error">{error}</div>}
        </form>
    )
}

export default TransactionForm