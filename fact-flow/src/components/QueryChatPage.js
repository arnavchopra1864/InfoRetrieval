import React, {useState} from 'react';

function QueryChatPage() {
  var docid = "file0";
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDocSel = (docNum) => {
    // const hostname = "http://localhost:5000/search?d=file0&u=139801c9-88f7-4cbf-829e-135feba4df6e";
    const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/search?u=139801c9-88f7-4cbf-829e-135feba4df6e&d="
    fetch(hostname + docid)
    .then(response => response.text())
    .then(data => {
      var doc_text = document.getElementById("document");
      doc_text.innerText = data;
      // console.log(data)
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };


  const handleSubmit = () => {
    const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/search/query?";
    var query_link = "";
    if (inputValue.trim() === '') {
      alert('Please enter a query');
      return;
    } else {
      query_link = hostname + 'u=' + '139801c9-88f7-4cbf-829e-135feba4df6e' + '&d=' + docid + '&q=' + inputValue.replace(/['"]+/g, '');
      //
      // alert(inputValue);
    }
    
    fetch(query_link)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      var chat = document.getElementById("chatresponse");
      chat.innerText = data;
    })
    .catch(error => {
      console.error('There was an error!', error);
    });

  };

  return (
    <div>x
      <h1>Chat with a document</h1>
      <div>
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
        <div id="chatresponse">response goes here</div>
      </div>
      <div className='doctext' id="document"> doc  goes here</div>
    </div>
  );
}

export default QueryChatPage;
