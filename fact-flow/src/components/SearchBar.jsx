import { useRef } from "react";
import { Input, InputGroup, InputLeftElement, Box } from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = ({ query, setQuery, onSearch, placeholder }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <IoSearchOutline color="gray.300" />
          </InputLeftElement>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            background={"white"}
            width="full"
          />
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchBar;
