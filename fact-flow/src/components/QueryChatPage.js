import React, {useState} from 'react';

function QueryChatPage() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDocSel = (docNum) => {
    const hostname = "http://localhost:5000/search?d=file0&u=139801c9-88f7-4cbf-829e-135feba4df6e";
    fetch(hostname)
    .then(response => response.json())
    .then(data => {
      var doc_text = document.getElementsByName("doctext");
      doc_text.innerText = data;
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
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
          <div className='doctext'>doc  goes here</div>
        <div>
          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <button onClick={handleDocSel(index + 1)} key={index + 1}>{index + 1}</button>
            ))}
          </div>
        </div>
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
