// QueryPage.js
import React, {useState} from 'react';
import '../styles/QueryPage.css';
import logo from "./logo.png";

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded); // Toggle the sidebar state
  };

  const [inputValue, setInputValue] = useState('');
  // const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // setIsSubmitted(true);
    const hostname = "http://localhost:5000/query?q=";
    var query_link = "";
    if (inputValue.trim() === '') {
      alert('Please enter a query');
      query_link = hostname + "What is the meaning of life?";
      // return;
    } else {
      query_link = hostname + inputValue.replace(/['"]+/g, '');
      alert(inputValue);
    }
    
    // send inputvalue to backend
    // send inputValue to backend without quotes
    fetch(query_link)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var result_doc = document.getElementById("result");
      var output = data.Response;
      var score = data["Reference 1: "
    ].Score;
      if (score >= 0.8) {
        output += "\n\n References: \n";
      
        Object.keys(data).forEach(key => {
          if (key.startsWith('Reference')) {
            console.log(key); 
            const nodeID = data[key]['Node ID']; 
            output += "Node ID: " + nodeID + "\n";
          }
        });
        result_doc.innerText = output;
      } else {
        result_doc.innerText = "\n\n No relevant references found.";
      }

    })
    .catch(error => {
      console.error('There was an error!', error);
    });

  };

  return (
    <div className="container">
      <div className="content">
        <img src={logo} alt="Logo" className="logo"/>

        <input 
            type="text" 
            className="search-box" 
            placeholder="Ask FactFlow a question..."
            value={inputValue} // Set the input field value
            onChange={handleInputChange} // Update state on input change
        />
        <button onClick={handleSubmit}>--></button>
        <div className="result" id="result"></div>
      </div>
      <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <button className="toggle-button" onClick={toggleSidebar} style={buttonStyle}>
            {isSidebarExpanded ? 'Collapse' : 'Expand'}
          </button>
          <div className="sidebar-content">
            <p>Query Folders will display here</p>
          </div>
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
