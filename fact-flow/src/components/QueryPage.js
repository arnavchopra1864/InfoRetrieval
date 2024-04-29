// QueryPage.js
import React, {useState} from 'react';
import '../styles/QueryPage.css';
import logo from "./logo.png";

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 
  const [inputValue, setInputValue] = useState('');

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded); // Toggle the sidebar state
  };


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q="
    var query_link = "http://127.0.0.1:5000/query?q=";
    var result_doc = document.getElementById("result");

    if (inputValue.trim() === '') {
      result_doc.innerText = "Please enter a query";
      return;
    } else {
      query_link = hostname + inputValue.replace(/['"]+/g, '') + '&u=' + Date.now();
    }
    
    result_doc.innerText = "Loading...";

    fetch(query_link)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var output = data.response;
      // FIX THIS LINE AFTER BACKEND IS FIXED
    //   var score = data["Reference1: "
    // ].Score;

      // if (score >= 0) {
      // output += data['response']
      output += "\n\n References: \n";
    
      Object.keys(data).forEach(key => {
        if (key.startsWith('Reference')) {
          console.log(key)
          var text = data[key]['chunk']
          output += key + text + '\n'
        }
      });
      result_doc.innerText = output;
      // } else {
      //   result_doc.innerText = "\n\n No relevant references found.";
      // }

    })
    .catch(error => {
      result_doc.innerText = "\n\n There was an error!";
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
