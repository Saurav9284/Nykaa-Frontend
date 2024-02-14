import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleShowClick = () => setShowPassword(!showPassword);

  const handlesignup = () => {
    navigate('/register')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = JSON.stringify({ email, password });

    fetch("https://nykamock-backend-production.up.railway.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((res) => {
        if (res.msg === "login successful") {
          const token = res.userData.token;
          const name = res.userData.name;
          sessionStorage.setItem("Token", token);
          sessionStorage.setItem("Name", name);
          toast({
            position: "top",
            title: res.msg,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/");
        } else {
          toast({
            position: "top",
            title: res.msg || "Login failed",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        toast({
          position: "top",
          title: "An error occurred during login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <div className="fromback">
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading className="formheader">Login to your account</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input 
                  type="email" 
                  placeholder="email address"
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                className="linear"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" onClick={handlesignup}>
          Sign Up
        </Link>
      </Box>
    </Flex>
    </div>
  );
};

export default Login;
