// QueryPage.js
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";
import { Heading, Box, Text, SimpleGrid, Card, Link } from "@chakra-ui/react";
import Lottie from "lottie-react";
import animationData from "../assets/loading-animation.json";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const QueryPage = () => {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();
  const [references, setReferences] = useState([]);

  const handleSubmit = () => {
    setIsLoading(true);
    const hostname =
      "https://factflow-backend-39dce4f4a0a2.herokuapp.com/query?q=";
    let query_link = "http://127.0.0.1:5000/query?q=";

    if (query.trim() === "") {
      console.log("Please enter a query");
      setIsLoading(false);
      return;
    } else {
      query_link = hostname + query.replace(/['"]+/g, "") + "&u=" + Date.now();
    }

    fetch(query_link)
      .then((response) => response.json())
      .then((data) => {
        setQuery("");
        setSearchedQuery(query);
        setResponse(data.response);

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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setIsLoading(false);
      });
  };

  return (
    <Box py={10} px={20}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSubmit}
        placeholder="Search..."
      />
      {isLoading && (
        <Box>
          <Lottie animationData={animationData} style={{ height: "50vh" }} />
        </Box>
      )}
      {!isLoading && (
        <>
          <Heading size="xl" mb={8} mt={12} fontWeight="semibold" color="black">
            {searchedQuery}
          </Heading>
          <Text fontSize="xl">{response}</Text>
          {references.length > 0 && (
            <>
              <Heading size="lg" my={8} fontWeight="semibold" color="black">
                References
              </Heading>
              <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 3 }} spacing={12}>
                {references.map((ref) => (
                  <Card p={6} boxShadow="lg" borderRadius="xl">
                    <Link mb={6} href={ref.url} isExternal>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="blue.500"
                      >
                        {ref.title}
                        <ExternalLinkIcon mx={2} />
                      </Text>
                    </Link>
                    <Text fontSize="md" color="gray.500">
                      ...{ref.text}...
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}{" "}
        </>
      )}
    </Box>
  );
};

export default QueryPage;
