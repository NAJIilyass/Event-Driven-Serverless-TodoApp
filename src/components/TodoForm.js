import { useState } from "react";

const TodoForm = ({ handleTriggerEffect }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, description }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            handleTriggerEffect();
            setTitle("");
            setDescription("");
            setError(null);
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
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
