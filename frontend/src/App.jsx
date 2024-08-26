import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Table from './components/Table'
import TodoForm from './components/TodoForm'

function App() {
  const [todos, setTodos] = useState("")
  const [isLoading, setisLoading] = useState(true)

  useEffect( () => {
    fetchData()
    console.log(todos);
  }, [])

  const fetchData = async () =>{
    try {
      const response = await axios.get("http://localhost:8000/api/todo/")
      setTodos(response.data)
      setisLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-indigo-100 px-8 min-h-screen'>
      <nav className='pt-8'>
        <h1 className='text-5xl text-center pb-12'>ToDo List</h1>
      </nav>
      <TodoForm
        setTodos = {setTodos}
        fetchData = {fetchData}
      />
      <Table
        todos = {todos}
        setTodos = {setTodos}
        isLoading  = {isLoading}
      />
    </div>
  )
}

export default App
