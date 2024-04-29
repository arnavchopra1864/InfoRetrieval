// QueryPage.js
import React, { useState, useEffect } from "react";
// import '../styles/QueryPage.css';
// import logo from "./logo.png";
import FileView from "./FileView.js";
// import Search from './query_Page/search.js'
import RefCard from "./query_Page/refCard.js";
import ResponseCard from "./query_Page/responseCard.js";
// import './query_Page/search.scss';
import SearchBar from "./SearchBar.jsx";
import { Heading, Box, Text, SimpleGrid, Card, Link } from "@chakra-ui/react";

const QueryPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState();
  const [references, setReferences] = useState([]);
  const [initialQuery, setInitialQuery] = useState("");

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded); // Toggle the sidebar state
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = (inputValue) => {
    console.log("SUBITTED");
    // const hostname = "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    const hostname =
      "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    var query_link = "http://127.0.0.1:5000/query?q=";

    if (inputValue.trim() === "") {
      console.log("really");
    } else {
      query_link =
        hostname + inputValue.replace(/['"]+/g, "") + "&u=" + Date.now();
    }

    fetch(query_link)
      .then((response) => response.json())
      .then((data) => {
        setInitialQuery(inputValue);
        setResponse(data.response);

        const refs = [];
        Object.keys(data).forEach((key) => {
          if (key.startsWith("Reference")) {
            console.log(key);
            const text = data[key]["chunk"];
            const url = data[key]["url"];
            const title = data[key]["title"];
            refs.push({ key, text, url, title });
          }
        });
        setReferences(refs);
        setInputValue("");
      });
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
    // <div className="container">
    //   <div className="content">
    //     <div className='search-bar'>
    //       <input type="search" placeholder="Search..." value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress}/>
    //       <button onClick={handleSubmit}>Go</button>
    //     </div>
    //     <div className='result'>
    //       {renderResponseCard()}
    //     </div>
    //     <div className='cards-container'>
    //       <h1>References</h1>
    //       <div className='reference-container'>
    //         {references.length > 0 && renderRefCards()}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Box py={10} px={20}>
      <SearchBar onSearch={handleSubmit} placeholder="Search..." />
      {initialQuery && (
        <Heading size="xl" my={8} fontWeight="semibold" color="black">
          {initialQuery}
        </Heading>
      )}
      <Text fontSize="xl">{response}</Text>
      {references.length > 0 && (
        <>
          <Heading size="xl" my={8} fontWeight="semibold" color="black">
            References
          </Heading>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} spacing={12}>
            {references.map((ref) => (
              <Card p={6} boxShadow="lg" borderRadius="xl">
                <Link mb={6} href={ref.link}>
                  <Text fontSize="lg" fontWeight="semibold" color="blue.500">
                    {ref.title}
                  </Text>
                </Link>
                <Text fontSize="md" color="gray.500">
                  ...{ref.text}...
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};

const buttonStyle = {
  backgroundColor: "#444", // Button background color
  color: "white", // Button text color
  border: "none",
  padding: "10px 20px",
  margin: "0 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default QueryPage;
