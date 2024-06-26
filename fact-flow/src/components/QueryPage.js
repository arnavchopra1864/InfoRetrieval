import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "./loading-animation.json";
import "../styles/QueryPage.css";
import FileView from "./FileView.js";
import RefCard from "./query_Page/refCard.js";
import ResponseCard from "./query_Page/responseCard.js";
import "./query_Page/search.scss";
import logoMain from "./logo_main.png";
import logo from "./logoblack.png";
import { MdErrorOutline } from "react-icons/md";

const QueryPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState();
  const [references, setReferences] = useState([]);
  const [initialQuery, setInitialQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [isSearch, setIsSearch] = useState(true);
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // If there's an ongoing request, abort it
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController for the new request
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    setError(false);
    setIsLoading(true);
    setIsSearch(false);

    const hostname =
      "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    // const hostname = "http://127.0.0.1:8000/query?q=";
    let query_link = "http://127.0.0.1:5000/query?q=";

    if (inputValue.trim() === "") {
      console.log("Please enter a query");
      setIsLoading(false);
      return;
    } else {
      query_link =
        hostname + inputValue.replace(/['"]+/g, "") + "&u=" + Date.now();
      setInitialQuery(inputValue);
    }

    fetch(query_link, { signal: newAbortController.signal })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.response);
        // console.log(data)

        const refs = [];
        Object.keys(data).forEach((key) => {
          if (key.startsWith("Reference")) {
            const text = data[key]["chunk"];
            const url = data[key]["url"];
            const title = data[key]["title"];
            refs.push({ key, text, url, title });
          }
        });
        setReferences(refs);
        setInputValue("");
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("There was an error!", error);
          setIsLoading(false);
          setError(true);
          setResponse("");
          setReferences([]);
        }
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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
      <ResponseCard
        query={initialQuery}
        text={response}
        className="resp-card"
      />
    ) : null;
  };
  return (
    <div className="container">
      <div className="content">
        {isSearch && (
          <img
            className="logo-main"
            src={logo}
            style={{ height: "40vh" }}
          ></img>
        )}
        <div className="search-bar">
          <input
            type="search"
            placeholder="Search..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSubmit}>Go</button>
        </div>
        {error && (
          <>
            <MdErrorOutline className="icon-error" />
            <p className="error">Oops! An error occurred. Please try again.</p>
          </>
        )}
        {isLoading && (
          <div className="loading-container">
            <Lottie animationData={animationData} style={{ height: "75vh" }} />
          </div>
        )}
        {!isLoading && (
          <>
            <div className="result">{renderResponseCard()}</div>
            {references.length > 0 && (
              <div className="cards-container">
                <h1>
                  <strong>References:</strong>
                </h1>
                <div className="reference-container">{renderRefCards()}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueryPage;
