import React, { useEffect, useState } from "react";
import CompletedTasks from "../components/CompletedTasks";
import PendingTasks from "../components/PendingTasks";
import TodoForm from "../components/TodoForm";
import { useTasksContext } from "../hooks/useTasksContext";

const Home = () => {
    const { tasks, dispatch } = useTasksContext();
    const [idToModifyNull, setIdToModifyNull] = useState("");

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await fetch(
                    "https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/"
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                dispatch({ type: "SET_TASKS", payload: data });
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        getTasks();
    }, [dispatch]);

    const handleOutsideClick = (event) => {
        if (!event.target.closest(".modifying-container")) {
            setIdToModifyNull("");
        }
    };

    const changeIdToModify = (id) => {
        setIdToModifyNull(id);
    };

    return (
        <div onClick={handleOutsideClick}>
            <div className="grid grid-cols-8 m-10">
                <div className="col-span-2 mt-20">
                    <TodoForm />
                </div>
                <div className="col-span-6 pl-12 flex flex-col gap-16">
                    <PendingTasks
                        tasks={tasks}
                        idToModifyNull={idToModifyNull}
                        changeIdToModify={changeIdToModify}
                    />
                    <CompletedTasks tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default Home;
