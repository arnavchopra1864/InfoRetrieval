// QueryPage.js
import React, {useState} from 'react';
import './QueryPage.css'; // Make sure to create a CSS file with the same name

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); 

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded); // Toggle the sidebar state
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    alert(`Submitting: ${inputValue}`);
    
    // send inputvalue to backend

  };

  return (
    <div className="container">
      <div className="content">
        <img src='./logo.png' alt="Logo" className="logo"/>

        <input 
            type="text" 
            className="search-box" 
            placeholder="Enter your query here"
            value={inputValue} // Set the input field value
            onChange={handleInputChange} // Update state on input change
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        {/* <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarExpanded ? 'Collapse' : 'Expand'} style={buttonStyle}
        </button> */}
        {/* Sidebar content goes here */}
        <p>Some sidebar content</p>
      </div>
    </div>
  );
};

const buttonStyle = {
    backgroundColor: '#444', // Button background color
    color: 'white', // Button text color
    border: 'none',
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

export default QueryPage;
