// pages/Tasks.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const addTask = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="p-3 bg-white shadow rounded flex justify-between">
            <span>{task.title}</span>
            <span className={task.completed ? "text-green-600" : "text-red-600"}>
              {task.completed ? "Done" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
