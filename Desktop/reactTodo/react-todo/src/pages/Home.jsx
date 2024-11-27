import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context, server } from "../main";
import toast from "react-hot-toast";
import TodoItem from "../components/TodoItem";
import { Navigate } from "react-router-dom";
function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { isAuthenticated } = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/task/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoader(true);
      const { data } = await axios.post(
        `${server}/task/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setTitle("");
      setDescription("");
      setLoader(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoader(false);
    }
  };

  useEffect(() => {
    axios
      .get(`https://nodejs-todobackend-azj8.onrender.com/api/v1/task/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setTasks(res.data.task);
        console.log(res.data.task);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [refresh]);
  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-green-300 text-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Add Task</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2" htmlFor="title">
              Title:
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-200 text-gray-900"
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-200 text-gray-800"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter task description"
              required
            />
          </div>
          <button
            disabled={loader}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
            type="submit"
          >
            Add Task
          </button>
        </form>
      </div>
      <section className="">
        {tasks.map((i) => (
          <TodoItem
            className="my-16"
            title={i.title}
            description={i.description}
            isCompleted={i.isCompleted}
            updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={i._id}
            key={i._id}
          />
        ))}
      </section>
    </div>
  );
}

export default Home;
