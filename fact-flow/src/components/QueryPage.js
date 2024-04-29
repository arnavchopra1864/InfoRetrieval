import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from './loading-animation.json'; // Replace 'your_animation.json' with the path to your Lottie animation file
import '../styles/QueryPage.css';
import FileView from './FileView.js';
import RefCard from './query_Page/refCard.js';
import ResponseCard from './query_Page/responseCard.js';
import './query_Page/search.scss';
import logoMain from './logo_main.png'
import logo from './logoblack.png';

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState();
  const [references, setReferences] = useState([]);
  const [initialQuery, setInitialQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setIsSearch(false);
    const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    let query_link = "http://127.0.0.1:5000/query?q=";

    if (inputValue.trim() === '') {
      console.log("Please enter a query");
      setIsLoading(false);
      return;
    } else {
      query_link = hostname + inputValue.replace(/['"]+/g, '') + '&u=' + Date.now();
    }

    fetch(query_link)
      .then(response => response.json())
      .then(data => {
        setInitialQuery(inputValue);
        setResponse(data.response);

        const refs = [];
        Object.keys(data).forEach((key) => {
          if (key.startsWith('Reference')) {
            const text = data[key]['chunk'];
            const url = data[key]['url'];
            const title = data[key]['title'];
            refs.push({ key, text, url, title });
          }
        });
        setReferences(refs);
        setInputValue('');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
        setIsLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const renderRefCards = () => {
    return references.map((ref, index) => (
      <RefCard key={index} text={ref.text} title={ref.title} link={ref.url} />
    ));
  };

  const renderResponseCard = () => {
    return response && references.length > 0 ? (
      <ResponseCard query={initialQuery} text={response} className='resp-card' />
    ) : null;
  };

  return (
    <div className="container">
      <div className="content">
        {isSearch && (
          <img className='logo-main' src={logo} style={{height:'40vh'}}></img>
        )}
        <div className='search-bar'>
          <input
            type="search"
            placeholder="Search..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSubmit}>Go</button>
        </div>
        {isLoading && (
          <div className="loading-container">
            <Lottie animationData={animationData} style={{height: '75vh'}}/>
          </div>
        )}
        {!isLoading && (
          <>
            <div className='result'>
              {renderResponseCard()}
            </div>
            {references.length > 0 && (
              <div className='cards-container'>
                <h1><strong>References:</strong></h1>
                <div className='reference-container'>
                  {renderRefCards()}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueryPage;
