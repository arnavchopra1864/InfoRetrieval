import React, {useState} from 'react';

function QueryChatPage() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    const hostname = "http://localhost:5000/query?q=";
    var query_link = "";
    if (inputValue.trim() === '') {
      alert('Please enter a query');
      return;
    } else {
      query_link = hostname + inputValue.replace(/['"]+/g, '');
      // alert(inputValue);
    }
    
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
    <div>
      <h1>Chat with a document</h1>
      <div>
        <p>
          document text goes here
        </p>
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Ask Questions" 
          className="search-box"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

export default QueryChatPage;
