import React, { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import "./CreatePW.css";

const CreatePW = ({ isFirstTime, mid }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [pw, setPW] = React.useState("");
  const [pw2, setPW2] = React.useState("");

  const [show2, setShow2] = React.useState(false);
  const handleClick2 = () => setShow2(!show2);

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (isFirstTime) {
      onOpen();
    }
  }, [isFirstTime]);

  const toast = useToast();
  const submitPW = () => {
    setLoading(true);
    try {
      if (pw === pw2) {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/firsttime`, {
          method: "POST",
          credentials: "include",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mid,
            password: pw.trim(),
            password2: pw2.trim(),
          }),
        }).then(async (res) => {
          setLoading(false);
          if (res.status === 200) {
            toast({
              title: "Password Created",
              description: "Redirecting...",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
            const response = await res.json();
            if (response.role === "S") window.location.href = "/";
            else if (response.role === "F") window.location.href = "/faculty";
          } else {
            const response = await res.json();
            toast({
              title: response.title,
              description: response.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        });
      } else {
        setLoading(false);
        toast({
          title: "Error",
          description: "Passwords do not match.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      onClose();
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              className="CreatePWHeader"
            >
              Create a New, Secure Password
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box className="CreatePW">
                <Text>
                  As You Are Logging In For the First Time, You Need To Create a
                  New Password
                </Text>

                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter Your New, Secure Password"
                    onChange={(e) => setPW(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show2 ? "text" : "password"}
                    placeholder="Confirm Your Password"
                    onChange={(e) => setPW2(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick2}>
                      {show2 ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={submitPW}
                ml={3}
                isLoading={loading}
              >
                Create Password
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CreatePW;
