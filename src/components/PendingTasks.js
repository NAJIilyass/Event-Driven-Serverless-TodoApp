import { React, useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { LuCheckCircle } from "react-icons/lu";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useTasksContext } from "../hooks/useTasksContext";

const PendingTasks = ({ tasks, idToModifyNull, changeIdToModify }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [idToModify, setIdToModify] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { dispatch } = useTasksContext();

    const handleDelete = async (task) => {
        try {
            const response = await fetch(
                `https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/${task.ToDoid.N}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            dispatch({ type: "DELETE_TASK", payload: data });
        } catch (error) {
            console.log(error);
        }
    };

    const toCompleting = async (task) => {
        dispatch({ type: "UPDATE_TASK", payload: { ...task, complete: true } });
        try {
            const response = await fetch(
                `https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/${task.ToDoid.N}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ complete: true }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const toModify = async (task, obj) => {
        dispatch({ type: "UPDATE_TASK", payload: { ...task, ...obj } });
        try {
            const response = await fetch(
                `https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/${task.ToDoid.N}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        changeIdToModify(idToModify);
    }, [idToModify]);

    useEffect(() => {
        if (idToModifyNull === "") {
            const modifyTask = async () => {
                if (!tasks || !Array.isArray(tasks)) {
                    // Handle the case when tasks is not defined or not an array
                    return;
                }

                let task1 = null;
                for (const task of tasks) {
                    if (task.ToDoid.N === idToModify) {
                        task1 = task;
                    }
                }

                if (!title && description) {
                    await toModify(task1, { description: description });
                    setDescription("");
                } else if (title && !description) {
                    await toModify(task1, { title: title });
                    setTitle("");
                } else if (title && description) {
                    await toModify(task1, {
                        title: title,
                        description: description,
                    });
                    setTitle("");
                    setDescription("");
                }

                setIdToModify(idToModifyNull);
            };

            modifyTask();
        }
    }, [idToModifyNull]);

    return (
        <div className="mx-6">
            {/*Title*/}
            <div>
                <p className="text-3xl font-bold text-orange-500 mb-4 select-none">
                    Pending Tasks
                </p>
            </div>

            {/*Arrow*/}
            <div
                onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                }}
                className="text-white select-none flex justify-between cursor-pointer font-bold text-xl border-b-2 py-4 mb-4"
            >
                <div className="flex justify-start gap-16">
                    <p className="w-24 ml-4">Title</p>
                    <p>Description</p>
                </div>
                <div className="mr-6 mt-1.5">
                    {!isDropdownOpen && <IoIosArrowDown />}
                    {isDropdownOpen && <IoIosArrowUp />}
                </div>
            </div>

            {/*Content*/}
            {isDropdownOpen &&
                tasks?.map(
                    (task) =>
                        task.complete &&
                        !task.complete.BOOL && (
                            <div
                                key={task.ToDoid.N}
                                className={
                                    idToModify === task.ToDoid.N
                                        ? "bg-white rounded-lg mb-4 modifying-container cursor-pointer"
                                        : "bg-white rounded-lg mb-4"
                                }
                            >
                                <div className="flex justify-between gap-8 p-4">
                                    {idToModify !== task.ToDoid.N && (
                                        <div className="flex justify-between gap-16 my-auto">
                                            <div className="w-24">
                                                <p className="w-full overflow-hidden font-semibold text-lg">
                                                    {task.title.S}
                                                </p>
                                            </div>
                                            <div className="w-auto">
                                                <p className="text-gray-500 w-full overflow-x-hidden text-justify mr-16">
                                                    {task.description.S}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {idToModify === task.ToDoid.N && (
                                        <form className="flex justify-between gap-16 my-auto">
                                            <input
                                                type="text"
                                                placeholder={task.title.s}
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                className="w-24 font-semibold text-lg flex flex-wrap p-4 -mb-3 -ml-2 -mr-4 -mt-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder={task.description.S}
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                                className="text-gray-500 text-justify p-4 -mb-3 ml-2 -mr-4 -mt-2 w-full"
                                            />
                                        </form>
                                    )}

                                    <div className="flex justify-center gap-2">
                                        <LuCheckCircle
                                            onClick={() => {
                                                setIdToModify("");
                                                toCompleting(task);
                                            }}
                                            size={22}
                                            className="mr-1 cursor-pointer text-green opacity-50 hover:opacity-100"
                                        />
                                        <FaPencil
                                            size={16}
                                            onClick={() =>
                                                setIdToModify(task.ToDoid.N)
                                            }
                                            className="mt-1 cursor-pointer text-blue-600 opacity-50 hover:opacity-100"
                                        />
                                        <MdDeleteOutline
                                            onClick={() => {
                                                setIdToModify("");
                                                handleDelete(task);
                                            }}
                                            size={23}
                                            className="cursor-pointer text-red-600 opacity-50 hover:opacity-100 "
                                        />
                                    </div>
                                </div>
                                <div className="tracking-widest pb-2 text-xs text-gray-500 ml-4">
                                    <p>
                                        {formatDistanceToNow(
                                            new Date(task.createdAt.S),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                            </div>
                        )
                )}
        </div>
    );
};

export default PendingTasks;
