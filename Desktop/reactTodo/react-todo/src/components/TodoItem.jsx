import React from "react";

function TodoItem({
  title,
  description,
  isCompleted,
  updateHandler,
  deleteHandler,
  id,
}) {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 my-4">
      <div className="border border-gray-300 rounded-xl p-4 shadow-lg">
        <div>
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="mt-2 flex items-center">
          <input
            onChange={() => {
              updateHandler(id);
            }}
            type="checkbox"
            checked={isCompleted}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <button
            onClick={() => {
              deleteHandler(id);
            }}
            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow focus:outline-none hover:bg-purple-800"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
