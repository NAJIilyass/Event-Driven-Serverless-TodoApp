import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BsXCircle } from "react-icons/bs";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useTasksContext } from "../hooks/useTasksContext";
import axios from "axios";

const CompletedTasks = ({ tasks }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { dispatch } = useTasksContext();

    const handleDelete = async (task) => {
        try {
            const response = await axios.delete(
                `https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/${task.ToDoid.N}`
            );

            if (!response.status === 200) {
                throw new Error("Network response was not ok");
            }

            const data = response.data;
            dispatch({ type: "DELETE_TASK", payload: data });
        } catch (error) {
            console.log(error);
        }
    };

    const toPending = async (task) => {
        dispatch({
            type: "UPDATE_TASK",
            payload: { ...task, complete: false },
        });
        try {
            const response = await axios.patch(
                `https://lkx2nweek8.execute-api.us-east-1.amazonaws.com/${task.ToDoid.N}`,
                { complete: false },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.status === 200) {
                throw new Error("Network response was not ok");
            }

            const data = response.data;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-6">
            {/*Title*/}
            <div>
                <p className="text-3xl font-bold text-green mb-4 select-none">
                    Completed Tasks
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
                        task.complete.BOOL && (
                            <div
                                key={task.ToDoid.N}
                                className="bg-green rounded-lg mb-4 "
                            >
                                <div className="flex justify-between gap-8 py-4 px-4">
                                    <div className="flex justify-between gap-16 my-auto">
                                        <p className="w-24 font-semibold text-lg text-white">
                                            {task.title.S}
                                        </p>
                                        <p className="text-justify mr-16 text-won">
                                            {task.description.S}
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <BsXCircle
                                            size={18}
                                            onClick={() => toPending(task)}
                                            className="mt-0.5 cursor-pointer text-black opacity-50 hover:opacity-100"
                                        />
                                        <MdDeleteOutline
                                            size={23}
                                            onClick={() => handleDelete(task)}
                                            className="cursor-pointer text-red-600 opacity-50 hover:opacity-100 "
                                        />
                                    </div>
                                </div>
                                <div className="tracking-widest pb-2 text-xs text-blue-300 ml-4">
                                    <p>
                                        {formatDistanceToNow(
                                            new Date(task.updatedAt.S),
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

export default CompletedTasks;
