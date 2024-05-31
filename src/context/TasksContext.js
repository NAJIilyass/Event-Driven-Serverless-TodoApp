import { createContext, useReducer } from 'react'

export const TasksContext = createContext()

//tasksReducer = (previousStateBeforeChange, action) => {} action : The action was that object we passed into the dispatch function and that object had a type and payload properties
export const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { 
        tasks: action.payload 
      }
    case 'CREATE_TASK':
      return { 
        tasks: [action.payload, ...state.tasks] //statet here is the previous state and action.payload us the new task
      }
      case 'UPDATE_TASK':
        const updatedTask = action.payload;
        return {
          ...state,
          tasks: state.tasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
        };      
    case 'DELETE_TASK':
      return { 
        tasks: state.tasks.filter(w => w._id !== action.payload._id) 
      }
    default:
      return state
  }
}

export const TasksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, { 
    tasks: null
  })

  return (
    <TasksContext.Provider value={{ ...state, dispatch }}>
      { children }
    </TasksContext.Provider>
  )
}