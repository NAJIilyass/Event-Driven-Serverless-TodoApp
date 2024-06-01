import React, { useEffect, useState } from "react";
import CompletedTasks from "../components/CompletedTasks";
import PendingTasks from "../components/PendingTasks";
import TodoForm from "../components/TodoForm";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [idToModifyNull, setIdToModifyNull] = useState("");
    const [triggerEffect, setTriggerEffect] = useState(false);

    const handleTriggerEffect = () => {
        setTriggerEffect(!triggerEffect);
    };

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
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        getTasks();
    }, [triggerEffect]);

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
                    <TodoForm handleTriggerEffect={handleTriggerEffect} />
                </div>
                <div className="col-span-6 pl-12 flex flex-col gap-16">
                    <PendingTasks
                        tasks={tasks}
                        idToModifyNull={idToModifyNull}
                        changeIdToModify={changeIdToModify}
                        handleTriggerEffect={handleTriggerEffect}
                    />
                    <CompletedTasks
                        tasks={tasks}
                        handleTriggerEffect={handleTriggerEffect}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
