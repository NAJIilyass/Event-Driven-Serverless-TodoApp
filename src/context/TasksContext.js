import { createContext, useReducer } from "react";

export const TasksContext = createContext();

export const tasksReducer = (state, action) => {
    console.log("Action dispatched:", action); // Log the action
    switch (action.type) {
        case "SET_TASKS":
            return {
                tasks: action.payload,
            };
        case "CREATE_TASK":
            return {
                tasks: [action.payload, ...state.tasks],
            };
        case "UPDATE_TASK":
            const updatedTask = action.payload;
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.ToDoid?.N === updatedTask.ToDoid?.N
                        ? updatedTask
                        : task
                ),
            };
        case "DELETE_TASK":
            return {
                tasks: state.tasks.filter(
                    (task) => task.ToDoid?.N !== action.payload.ToDoid?.N
                ),
            };
        default:
            return state;
    }
};

export const TasksContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: null,
    });

    return (
        <TasksContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TasksContext.Provider>
    );
};
