import React, { useEffect, useState } from "react";
import CompletedTasks from "../components/CompletedTasks";
import PendingTasks from "../components/PendingTasks";
import TodoForm from "../components/TodoForm";
import axios from "axios";
import { useTasksContext } from "../hooks/useTasksContext";

const Home = () => {
    const baseUrl = "http://localhost:4000";
    const { tasks, dispatch } = useTasksContext();
    const [idToModifyNull, setIdToModifyNull] = useState("");

    // useEffect(() => {
    //     const getTasks = async () => {
    //         try {
    //             const response = await axios.get(`${baseUrl}/api/tasks`, {
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`,
    //                 },
    //             });
    //             const data = response.data;
    //             dispatch({ type: "SET_TASKS", payload: data });
    //         } catch (error) {
    //             console.error("Error fetching task:", error);
    //         }
    //     };
    //     getTasks();
    // }, [dispatch]);

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
                    <TodoForm baseUrl={baseUrl} />
                </div>
                <div className="col-span-6 pl-12 flex flex-col gap-16">
                    <PendingTasks
                        baseUrl={baseUrl}
                        tasks={tasks}
                        idToModifyNull={idToModifyNull}
                        changeIdToModify={changeIdToModify}
                    />
                    <CompletedTasks baseUrl={baseUrl} tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default Home;
