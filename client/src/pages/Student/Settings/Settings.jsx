import React, { useEffect } from "react";
import "./Settings.css";
import {
  Box,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Switch,
  useColorMode,
  Button,
  InputRightElement,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Settings = () => {
  useAuthCheck("S")
  const [toastDispatched, setToastDispatched] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();

  const [show1, setShow1] = React.useState(false);
  const handleClick1 = () => setShow1(!show1);

  const [show2, setShow2] = React.useState(false);
  const handleClick2 = () => setShow2(!show2);

  const [show3, setShow3] = React.useState(false);
  const handleClick3 = () => setShow3(!show3);

  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [err, setErr] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const validatePassMatch = (pass) => {
    setConfirmPass(pass);
    if (pass === newPass) {
      setErr("");
      setToastDispatched(true);
    } else {
      setErr("Passwords do not match");
      setToastDispatched(false);
    }
  };

  const sendNewPass = () => {
    if (oldPass === "" || newPass === "" || confirmPass === "") {
      setErr("Please fill all the fields");
      setToastDispatched(false);
    } else if (newPass !== confirmPass) {
      setErr("Passwords do not match");
      setToastDispatched(false);
    } else if (newPass === oldPass) {
      setErr("New Password cannot be same as Old Password");
      setToastDispatched(false);
    } else {
      setErr("");
      setIsButtonLoading(true);
      fetch(
        `${import.meta.env.VITE_BACKEND_ADDRESS}/student/profile/updatePW`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPass: oldPass.toString(), newPass: newPass.toString() }),
        }
      )
        .then(async (res) => {
          setIsButtonLoading(false);
          if (res.status === 401) {
            toast({
              title: "Password Change Failed! Old Password is Incorrect",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            return await res.json();
          }
        })
        .then((data) => {
          if (data.success === true) {
            toast({
              title: "Password Changed Successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
            setToastDispatched(false);
          } else {
            toast({
              title: "Password Change Failed!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Password Change Failed!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (toastDispatched) {
      toast({
        position: "bottom-left",
        title: "Heads up! You Have Unsaved Changes. Save to Apply!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setToastDispatched(true);
    }
  }, [toastDispatched]);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="StudentSettings">
          <Box className="wrapper">
            <Heading alignSelf="flex-start">Settings</Heading>
            <FormControl
              display="flex"
              alignItems="center"
              className="formcontrol"
            >
              <FormLabel htmlFor="email-alerts" mb="0">
                Dark Mode
              </FormLabel>
              <Switch
                id="email-alerts"
                onChange={(e) => {
                  toggleColorMode();
                  window.location.reload()
                }}
                isChecked={colorMode === "dark" ? true : false}
              />
            </FormControl>
            <Divider />
            <FormControl display="flex" flexDirection="column" gap="20px">
              <Text>Change Password</Text>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show1 ? "text" : "password"}
                  placeholder="Enter Old Password"
                  onChange={(e) => setOldPass(e?.target?.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick1}>
                    {show1 ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show2 ? "text" : "password"}
                  placeholder="Enter New Password"
                  onChange={(e) => setNewPass(e?.target?.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick2}>
                    {show2 ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show3 ? "text" : "password"}
                  placeholder="Confirm New Password"
                  onChange={(e) => validatePassMatch(e?.target?.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick3}>
                    {show3 ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text color="red">{err}</Text>
            </FormControl>
            <Button
              isLoading={isButtonLoading}
              alignSelf="flex-end"
              colorScheme="green"
              isDisabled={!toastDispatched}
              onClick={() => {
                sendNewPass();
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Settings;
