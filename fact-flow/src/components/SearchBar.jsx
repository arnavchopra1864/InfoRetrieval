import { useRef } from "react";
import { Input, InputGroup, InputLeftElement, Box } from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = ({ onSearch, placeholder }) => {
  // TODO: use react-hook-form
  const ref = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (ref.current) {
      try {
        await onSearch(ref.current.value);
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <IoSearchOutline color="gray.300" />
          </InputLeftElement>
          <Input
            ref={ref}
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