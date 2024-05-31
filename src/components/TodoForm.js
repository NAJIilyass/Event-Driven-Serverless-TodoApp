import { useState } from "react";
import axios from "axios";
import { useTasksContext } from "../hooks/useTasksContext";

const TodoForm = ({ baseUrl }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const { dispatch } = useTasksContext();

    const handleSubmit = async (e) => {
        // e.preventDefault();
        // try {
        //     const createdTask = await axios.post(
        //         `${baseUrl}/api/tasks`,
        //         {
        //             title,
        //             description,
        //         },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${user.token}`,
        //             },
        //         }
        //     );
        //     const data = createdTask.data;
        //     dispatch({ type: "CREATE_TASK", payload: data });
        //     setTitle("");
        //     setDescription("");
        //     setError(null);
        // } catch (error) {
        //     setError(error);
        //     console.log(error);
        // }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="sticky top-24 grid grid-cols-1 gap-4 w-full mx-auto bg-white rounded py-4"
        >
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="border border-gray-400 rounded px-4 py-2 w-11/12 mx-auto"
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border border-gray-400 rounded px-4 w-11/12 mx-auto py-3"
                rows={10}
                required
            ></textarea>

            <button className="bg-green text-lg font-normal text-white rounded px-4 py-2 w-1/2 mx-auto">
                Save
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default TodoForm;
