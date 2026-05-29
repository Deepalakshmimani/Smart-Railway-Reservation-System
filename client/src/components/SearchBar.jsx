import React, { useState } from "react";
import "./SearchBar.css";

const Search = ({onSearch}) => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(form);
  };

  return (
    <div className="search-section">
      <h2>Search Trains</h2>

      <div className="search-box">
        <input
          type="text"
          name="from"
          placeholder="From (e.g., Chennai)"
          value={form.from}
          onChange={handleChange}
        />

        <input
          type="text"
          name="to"
          placeholder="To (e.g., Bangalore)"
          value={form.to}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Search;