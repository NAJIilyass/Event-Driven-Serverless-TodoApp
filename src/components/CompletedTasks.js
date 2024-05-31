import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BsXCircle } from "react-icons/bs";
import axios from "axios";
import { useTasksContext } from "../hooks/useTasksContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const CompletedTasks = ({ baseUrl, tasks }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { dispatch } = useTasksContext();

    const handleDelete = async (task) => {
        // try {
        //     const deletedTask = await axios.delete(`${baseUrl}/api/tasks/${task._id}`,
        //     {headers: {
        //         Authorization: `Bearer ${user.token}`,
        //     }})
        //     const data = deletedTask.data
        //     dispatch({type: 'DELETE_TASK', payload: data})
        // }catch(error){
        //     console.log(error)
        // }
    };

    const toPending = async (task) => {
        // dispatch({
        //     type: "UPDATE_TASK",
        //     payload: { ...task, complete: false },
        // });
        // try {
        //     const updatedTask = await axios.patch(
        //         `${baseUrl}/api/tasks/${task._id}`,
        //         {
        //             complete: false,
        //         },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${user.token}`,
        //             },
        //         }
        //     );
        //     const data = updatedTask.data;
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <div className="mx-6">
            <div>
                <p className="text-3xl font-bold text-green mb-4 select-none">
                    Completed Tasks
                </p>
            </div>
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

            {isDropdownOpen &&
                tasks?.map(
                    (task) =>
                        task.complete && (
                            <div
                                key={task._id}
                                className="bg-green rounded-lg mb-4 "
                            >
                                <div className="flex justify-between gap-8 py-4 px-4">
                                    <div className="flex justify-between gap-16 my-auto">
                                        <p className="w-24 font-semibold text-lg text-white">
                                            {task.title}
                                        </p>
                                        <p className="text-justify mr-16 text-won">
                                            {task.description}
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
                                            new Date(task.updatedAt),
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
