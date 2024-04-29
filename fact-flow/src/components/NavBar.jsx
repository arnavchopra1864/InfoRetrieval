import { useNavigate } from "react-router-dom";
import { Box, Flex, Button, Heading, HStack, Image } from "@chakra-ui/react";
import logo from "../assets/logo_main.png";

function NavBar({ activeName }) {
  const navigate = useNavigate();

  const pages = [
    { label: "Query", href: "/query" },
    { label: "Chat", href: "/chat" },
    { label: "Account", href: "/login" },
  ];

  return (
    <div id="page">
      <Box p={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack h="100%" onClick={() => navigate("/")} cursor="pointer">
            <Image src={logo} h={16} />
          </HStack>
          <HStack spacing={4}>
            {pages.map((page) => (
              <Button
                key={page.label}
                size="lg"
                variant={activeName === page.label ? "solid" : "ghost"}
                onClick={() => navigate(page.href)}
              >
                {page.label}
              </Button>
            ))}
          </HStack>
        </Flex>
      </Box>
    </div>
  );
}

export default NavBar;
