import {
  Box,
  Button,
  Flex,
  Input,
  InputAddon,
  PinInput,
  HStack,
  PinInputField,
} from "@chakra-ui/react";
import React from "react";
import { useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Forgot = () => {
  const toast = useToast();
  const [moodle, setMoodle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [otp, setOtp] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [cPw, setCPw] = React.useState("");

  const sendOTP = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/forgot/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: moodle }),
    }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setStep(1);
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your email",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else if (res.status === 400) {
        toast({
          title: "Error",
          description: "No Email Associated with This ID. Contact Admin",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "OTP could not be sent",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error(res);
      }
    });
  };

  const verifyOtp = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/forgot/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: moodle, otp: otp }),
    }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setStep(2);
        toast({
          title: "OTP Verified",
          description: "OTP has been verified",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else if (res.status === 400) {
        toast({
          title: "Error",
          description: "OTP is incorrect",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "OTP could not be verified",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error(res);
      }
    });
  };

  const setPassword = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/forgot/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: moodle, otp: otp, password: pw }),
    }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setStep(1);
        toast({
          title: "Password Set",
          description: "Password has been set",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else if (res.status === 400) {
        toast({
          title: "Error",
          description: "Session Expired",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Password could not be set",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error(res);
      }
    });
  };

  return (
    <>
      {step === 0 ? (
        <Flex
          align="center"
          justify="center"
          height="100vh"
          direction="column"
          gap="20px"
        >
          <h1>Forgot</h1>

          <Flex align="center" direction="column">
            <p>Enter Your Moodle ID</p>
            <p>
              If no Email is associated with your account, please contact your
              administrator
            </p>
          </Flex>

          <Input
            type="text"
            placeholder="Moodle ID"
            width="20vw"
            value={moodle}
            onChange={(e) => setMoodle(e.target.value)}
          />
          <Button
            isLoading={loading}
            backgroundColor="black"
            color="white"
            border="2px solid white"
            onClick={sendOTP}
          >
            Send Email
          </Button>
        </Flex>
      ) : step === 1 ? (
        <Flex
          align="center"
          justify="center"
          height="100vh"
          direction="column"
          gap="20px"
        >
          <h1>Forgot</h1>

          <Flex align="center" direction="column">
            <p>Enter the OTP Send to Your Email</p>
          </Flex>

          <HStack>
            <PinInput value={otp} onChange={setOtp} otp>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <Button
            isLoading={loading}
            backgroundColor="black"
            color="white"
            border="2px solid white"
            onClick={verifyOtp}
          >
            Verify
          </Button>
        </Flex>
      ) : (
        <Flex
          align="center"
          justify="center"
          height="100vh"
          direction="column"
          gap="20px"
        >
          <h1>Forgot</h1>

          <Flex align="center" direction="column">
            <p>Create a New Password</p>
          </Flex>

          <Input
            type="password"
            placeholder="Password"
            width="20vw"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            width="20vw"
            value={cPw}
            onChange={(e) => setCPw(e.target.value)}
          />

          <Button
            isLoading={loading}
            backgroundColor="black"
            color="white"
            border="2px solid white"
            onClick={setPassword}
          >
            Verify
          </Button>
          <Link to="/auth">Go back to Login</Link>
        </Flex>
      )}
    </>
  );
};

export default Forgot;
