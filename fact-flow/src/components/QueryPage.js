// QueryPage.js
import React, { useState, useEffect } from 'react';
import '../styles/QueryPage.css';
// import logo from "./logo.png";
import FileView  from './FileView.js';
// import Search from './query_Page/search.js'
import RefCard from './query_Page/refCard.js';
import ResponseCard from './query_Page/responseCard.js';
import './query_Page/search.scss'

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); 
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState()
  const [references, setReferences] = useState([]);
  const [initialQuery, setInitialQuery] = useState('');


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
  
      if (inputValue.trim() === '') {
          console.log("really");
      } else {
        query_link = hostname + inputValue.replace(/['"]+/g, '') + '&u=' + Date.now();
        setInitialQuery(inputValue); 
      }
  
      fetch(query_link)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResponse(data.response);


        const refs = [];
        Object.keys(data).forEach((key) => {
        if (key.startsWith('Reference')) {
          console.log(key);
          const text = data[key]['chunk'];
          const url = data[key]['url'];
          const title = data[key]['title'];
          refs.push({ key, text, url, title});
        }
    });
    setReferences(refs);
    })
  }

  const renderRefCards = () => {
    return references.map((ref, index) => (
      <RefCard key={index} text={ref.text} title={ref.title} link={ref.url} />
    ));
  };

  const renderResponseCard = () => {
    return response && references.length > 0 ? (
      <ResponseCard query={initialQuery} text={response} className='resp-card'/>
    ) : null;
  };
 
  return (
    <div className="container">
      <div className="content">
        <div className='search-bar'>
          <input type="search" placeholder="Search..." value={inputValue} onChange={handleInputChange} />
          <button onClick={handleSubmit}>Go</button>
        </div>
        <div className='result'>
          {renderResponseCard()}
        </div>
        <div className='cards-container'>
          <h1>References</h1>
          <div className='reference-container'>
            {references.length > 0 && renderRefCards()}
          </div>
        </div>
      </div>
    </div>
  );
};




  // const handleSubmit = () => {
  //   // const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
  //   const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q="
  //   var query_link = "http://127.0.0.1:5000/query?q=";
  //   var result_doc = document.getElementById("result");

  //   if (inputValue.trim() === '') {
  //     result_doc.innerText = "Please enter a query";
  //     return;
  //   } else {
  //     query_link = hostname + inputValue.replace(/['"]+/g, '') + '&u=' + Date.now();
  //   }
    
  //   result_doc.innerText = "Loading...";

  //   fetch(query_link)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     var output = data.response;
  //     setResponse(output)
  //     // FIX THIS LINE AFTER BACKEND IS FIXED
  //   //   var score = data["Reference1: "
  //   // ].Score;

  //     // if (score >= 0) {
  //     // output += data['response']
  //     //output += "\n\n References: \n";
    
  //     // var i = 0;
  //     // Object.keys(data).forEach(key => {
  //     //   if (key.startsWith('Reference')) {
  //     //     console.log(key)
  //     //     var text = data[key]['chunk']
          
  //     //     output += key + text + '\n'
  //     //   }
  //     // });
  //     console.log(output)
  //     result_doc.innerText = output;
  //     // } else {
  //     //   result_doc.innerText = "\n\n No relevant references found.";
  //     // }

  //   })
  //   // .catch(error => {
  //   //   result_doc.innerText = "\n\n There was an error!";
  //   //   console.error('There was an error!', error);
  //   // });

  // };

  // return (
  //   <div className="container">
  //     {/* <div className="content">
  //       <img src={logo} alt="Logo" className="logo" />

  //       <input
  //         type="text"
  //         className="search-box"
  //         placeholder="Ask FactFlow a question..."
  //         value={inputValue}
  //         onChange={handleInputChange}
  //       />
  //       <button onClick={handleSubmit}>--></button>
  //       <div className="result" id="result"></div>
  //     </div> */}

  //     <div className="content">
  //           <div className='search-bar'>
  //           {/* <form role="search"> */}
  //           <input type="search" placeholder="Search..." value={inputValue} onChange={handleInputChange} />
  //           <button onClick={handleSubmit}>Go</button>    
  //           {/* </form> */}
  //           </div>
  //           {/* <input
  //         type="text"
  //         className="search-box"
  //         placeholder="Ask FactFlow a question..."
  //         value={inputValue}
  //         onChange={handleInputChange}
  //       />
  //       <button onClick={handleSubmit}></button> */}
  //           <div className="result" id="result"></div>
  //           <div className='cards-container'>
  //             {/* <h1>AI Summary</h1> */}
  //             <div className='response-container'>
  //               <ResponseCard query="What are LLMs?" text={response} className='resp-card'/>
  //             </div>
  //             <h1>References</h1>
  //             <div className='reference-container'>
  //               <RefCard className='ref-card' text="Large Language Models (LLMs)Large Language Modelspowered by world-class Google AIHighlightsWhat LLM services does Google Cloud offer?Train your own LLMsHow do LLMs work at Google Cloud?Introduction to large language models15:45OverviewWhat is a large languagemodel (LLM)?A large language model (LLM) is a statistical languagemodel, trained on a massive amount of data, that can beused to generate and translate text and other content, andperform other natural language processing (NLP)tasks.LLMs are typically based on deep learning architectures,such as theTransformerdeveloped by Google in 2017, and can be trained onbillions of text and other content.What " title="sdfkdsfnksdnf" link="https://www.google.com/"/>
  //               <RefCard className='ref-card' text="Large Language Models (LLMs)Large Language Modelspowered by world-class Google AIHighlightsWhat LLM services does Google Cloud offer?Train your own LLMsHow do LLMs work at Google Cloud?Introduction to large language models15:45OverviewWhat is a large languagemodel (LLM)?A large language model (LLM) is a statistical languagemodel, trained on a massive amount of data, that can beused to generate and translate text and other content, andperform other natural language processing (NLP)tasks.LLMs are typically based on deep learning architectures,such as theTransformerdeveloped by Google in 2017, and can be trained onbillions of text and other content.What " title="sdfkdsfnksdnf" link="https://www.google.com/"/>
  //               <RefCard className='ref-card' text="Large Language Models (LLMs)Large Language Modelspowered by world-class Google AIHighlightsWhat LLM services does Google Cloud offer?Train your own LLMsHow do LLMs work at Google Cloud?Introduction to large language models15:45OverviewWhat is a large languagemodel (LLM)?A large language model (LLM) is a statistical languagemodel, trained on a massive amount of data, that can beused to generate and translate text and other content, andperform other natural language processing (NLP)tasks.LLMs are typically based on deep learning architectures,such as theTransformerdeveloped by Google in 2017, and can be trained onbillions of text and other content.What " title="sdfkdsfnksdnf" link="https://www.google.com/"/>
  //               <RefCard className='ref-card' text="Large Language Models (LLMs)Large Language Modelspowered by world-class Google AIHighlightsWhat LLM services does Google Cloud offer?Train your own LLMsHow do LLMs work at Google Cloud?Introduction to large language models15:45OverviewWhat is a large languagemodel (LLM)?A large language model (LLM) is a statistical languagemodel, trained on a massive amount of data, that can beused to generate and translate text and other content, andperform other natural language processing (NLP)tasks.LLMs are typically based on deep learning architectures,such as theTransformerdeveloped by Google in 2017, and can be trained onbillions of text and other content.What " title="sdfkdsfnksdnf" link="https://www.google.com/"/>
  //               <RefCard className='ref-card' text="Large Language Models (LLMs)Large Language Modelspowered by world-class Google AIHighlightsWhat LLM services does Google Cloud offer?Train your own LLMsHow do LLMs work at Google Cloud?Introduction to large language models15:45OverviewWhat is a large languagemodel (LLM)?A large language model (LLM) is a statistical languagemodel, trained on a massive amount of data, that can beused to generate and translate text and other content, andperform other natural language processing (NLP)tasks.LLMs are typically based on deep learning architectures,such as theTransformerdeveloped by Google in 2017, and can be trained onbillions of text and other content.What " title="sdfkdsfnksdnf" link="https://www.google.com/"/>
  //             </div>
  //           </div>
  //         </div>
  //     {/* <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
  //       <button className="toggle-button" onClick={toggleSidebar} style={buttonStyle}>
  //         {isSidebarExpanded ? 'Hide Stored Files' : 'View Stored Files'}
  //       </button>
  //       <div className="sidebar-content">
  //         <div className="file-view">
  //           <FileView />
  //         </div>
  //       </div>
  //     </div> */}
  //   </div>
  // );

  // return (<QueryMain />)


// };



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