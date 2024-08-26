import React, { useState } from 'react'
import axios from 'axios'
import { MdOutlineDeleteOutline, MdEditNote, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineDelete } from 'react-icons/md'

const Table = ({todos, setTodos, isLoading}) => {
    const [editText, setEditText] = useState({
        'body' : ''
    })

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/todo/${id}/`)
            const newList = todos.filter(todo => todo.id !== id) // Only keep the todos that don't have the deleted id
            setTodos(newList)
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = async (id, value) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/todo/${id}/`, value)
            // Loop through the todos. If the todo id is the same as the passed in id, get the new response data; else, just return the todo
            const newTodos = todos.map(todo => todo.id === id ? response.data : todo)
            setTodos(newTodos)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckbox = (id, value) => {
        handleEdit( id, {
            'completed' : !value
        })
    }

    const handleChange = (e) => {
       setEditText( prev => ({
        ...prev,
        'body' : e.target.value
       }))
       console.log(editText);
    }

    const handleClick = () => {
        handleEdit(editText.id, editText)
        setEditText({
            'body' : ''
        })
    }

    return (
        <div className='py-2'>
            <table className='w-11/12 max-w-4xl'>
                <thead className='border-b-2 border-black'>
                    <tr>
                        <th className='p-3 text-sm font-semibold tracking-wide text-left'>Checkbox</th>
                        <th className='p-3 text-sm font-semibold tracking-wide text-left'>To Do</th>
                        <th className='p-3 text-sm font-semibold tracking-wide text-left'>Status</th>
                        <th className='p-3 text-sm font-semibold tracking-wide text-left'>Date Created</th>
                        <th className='p-3 text-sm font-semibold tracking-wide text-left'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <div>Loading...</div> :
                        <>
                            {todos.map( (todoItem, index) => 
                            (
                                <tr key={todoItem.id} className='border-b border-black'>
                                    <td className='p-3' title={todoItem.completed}>
                                        <span onClick={() => handleCheckbox(todoItem.id, todoItem.completed)} className='inline-block cursor-pointer'>
                                            {todoItem.completed ? <MdOutlineCheckBox/> : <MdOutlineCheckBoxOutlineBlank/>}
                                        </span>
                                    </td>
                                    <td className='p-3 text-sm'>{todoItem.body}</td>
                                    <td className='p-3 text-sm text-center'>
                                        <span className={`p-1.5 text-xs font-medium tracing-wider rounded-md ${todoItem.completed ? 'bg-green-300' : 'bg-red-300'}`}>
                                            {todoItem.completed ? 'Done' : 'Incomplete'}
                                        </span>
                                    </td>
                                    <td className='p-3 text-sm'>{new Date(todoItem.created).toLocaleString()}</td>
                                    <td className='p-3 text-sm font-medium grid grid-flow-col items-center mt-5'>
                                        <span className='text-xl cursor-pointer'>
                                            <label htmlFor="my-modal" onClick={() => setEditText(todoItem)} className="btn"><MdEditNote/></label>
                                        </span>
                                        <span className='text-xl cursor-pointer'><MdOutlineDeleteOutline onClick={() => handleDelete(todoItem.id)}/></span>
                                    </td>
                                </tr>
                            )
                            )}
                        </>}
                </tbody>
            </table>

            {/* Modal */}
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Edit Todo</h3>
                    <input type="text" value={editText.body} onChange={handleChange} className="input input-bordered w-full mt-8" />
                    <div className="modal-action">
                        <label htmlFor="my-modal" onClick={handleClick} className="btn btn-primary">Save</label>
                        <label htmlFor="my-modal" className="btn">Cancel</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table