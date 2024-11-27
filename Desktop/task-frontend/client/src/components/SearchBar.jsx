import React from "react";
import useCustomHook from "./useCustomHook"; 

function SearchBar(props) {
  // Call your custom hook
  const { data, loading, error } = useCustomHook();

  // Render your component based on the hook data, loading state, and error state
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
