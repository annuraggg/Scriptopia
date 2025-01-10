import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  InputRightElement,
  InputGroup,
  useToast,
  Link,
} from "@chakra-ui/react";
import APSIT from "./../../assets/img/apsit-logo.png";
import Logo from "./../../assets/img/logo.png";
import "./Auth.css";
import CreatePW from "./CreatePW";
import Cookie from "js-cookie";
import { io } from "../../events/socketConnection";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [mid, setMid] = useState("");
  const [fact, setFact] = useState("");

  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const redirectURL =
    new URLSearchParams(window.location.search).get("redirect") || "/";

  useEffect(() => {
    if (Cookie.get("blocked")) {
      setDisabled(true);
    }
    localStorage.removeItem("chakra-ui-color-mode");
  }, []);

  useEffect(() => {
    if (attempts === 5) {
      history.replaceState({}, "/auth", "/auth?err=max");
      setErr("Too Many Attempts");
      setDisabled(true);
      const now = new Date();
      const expirationTime = new Date(now.getTime() + 1000 * 60 * 2); // 2 minutes in milliseconds2 * 60 *
      document.cookie =
        "blocked=true; expires=" + expirationTime.toUTCString() + "; path=/";

      toast({
        title: "Too many attempts",
        description: "Please try again after some time.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        setDisabled(false);
        history.replaceState({}, "/auth?err=max", "/auth");
      }, 5000);
    }
  }, [attempts]);

  const programming_facts = [
    "The first computer bug was a real bug – a moth found trapped in a Harvard Mark II computer in 1947.",
    "The term 'bug' to describe a glitch in a computer system was coined by Grace Hopper when a moth caused an error in the Mark II computer in 1947.",
    "The world's first computer programmer was Ada Lovelace, an English mathematician and writer.",
    "The QWERTY keyboard layout was designed to slow down typing and prevent mechanical jams in typewriters.",
    "The ENIAC computer, one of the earliest general-purpose computers, weighed about 27 tons.",
    "JavaScript was created in 10 days by Brendan Eich while he worked at Netscape.",
    "The C programming language was developed by Dennis Ritchie at Bell Labs in the early 1970s.",
    "Linux, an open-source operating system kernel, was created by Linus Torvalds in 1991.",
    "The first version of Windows, Windows 1.0, was released by Microsoft in 1985.",
    "Python was named after the British comedy show 'Monty Python's Flying Circus.'",
    "Java was originally called 'Oak' but was renamed 'Java' due to trademark issues.",
    "The '@' symbol in email addresses was chosen by Ray Tomlinson, the inventor of email.",
    "The HTML acronym stands for 'Hypertext Markup Language.'",
    "The first computer mouse was made of wood and had only one button.",
    "The world's first computer virus, the Creeper virus, was written in 1971.",
    "The programming language COBOL, developed in the late 1950s, is still used in legacy systems.",
    "The Windows operating system was named after its GUI component – overlapping windows.",
    "The number of possible combinations in a deck of playing cards is greater than the number of atoms on Earth.",
    "The acronym 'HTTP' stands for 'Hypertext Transfer Protocol.'",
    "The first recorded computer-generated music was created by Alan Turing's computer in 1951.",
    "CAPTCHA stands for 'Completely Automated Public Turing test to tell Computers and Humans Apart.'",
    "The original source code for the World Wide Web was written in the NeXTSTEP programming environment.",
    "The Linux mascot, Tux, is a penguin chosen because penguins are known to be loyal and cooperative.",
    "A 'byte' was coined by Werner Buchholz, an IBM engineer, as a term to describe groups of bits.",
    "The C++ programming language was an extension of the C programming language.",
    "The first computer programmer in space was a NASA astronaut, John Howard, who wrote code for Apollo missions.",
    "The Commodore 64, released in 1982, is one of the best-selling personal computers in history.",
    "The 'Hello, World!' program is a traditional way to introduce a programming language to beginners.",
    "The original Apple Macintosh, released in 1984, had only 128KB of RAM.",
    "The term 'bit' is a contraction of 'binary digit.'",
    "The C# programming language, pronounced 'C-sharp,' was developed by Microsoft.",
    "The first video game with recognizable graphics was 'Spacewar!' developed in 1962.",
    "The concept of object-oriented programming was developed in the 1960s but gained popularity in the 1980s.",
    "The first domain name ever registered was 'symbolics.com' on March 15, 1985.",
    "The game 'Pong' was one of the earliest video games and simulated table tennis.",
    "The 'Shift' key on a keyboard was introduced to allow the typewriter mechanism to shift position.",
    "The 'Ctrl' key (Control key) was first introduced on the QWERTY keyboard in the 1960s.",
    "The C# programming language, pronounced 'C-sharp,' was developed by Microsoft.",
    "The first video game with recognizable graphics was 'Spacewar!' developed in 1962.",
    "The concept of object-oriented programming was developed in the 1960s but gained popularity in the 1980s.",
    "The first domain name ever registered was 'symbolics.com' on March 15, 1985.",
    "The game 'Pong' was one of the earliest video games and simulated table tennis.",
    "The 'Shift' key on a keyboard was introduced to allow the typewriter mechanism to shift position.",
    "The 'Ctrl' key (Control key) was first introduced on the QWERTY keyboard in the 1960s.",
    "The concept of a 'bug' in a computer system originated from a literal insect – a moth – causing a malfunction.",
    "The Commodore Amiga, released in 1985, was one of the first personal computers with advanced multimedia capabilities.",
    "The acronym 'SQL' stands for 'Structured Query Language.'",
    "The concept of a 'bug' in a computer system originated from a literal insect – a moth – causing a malfunction.",
    "The Commodore Amiga, released in 1985, was one of the first personal computers with advanced multimedia capabilities.",
    "The acronym 'SQL' stands for 'Structured Query Language.'",
    "The concept of 'open-source' software involves sharing the source code publicly and allowing anyone to modify and distribute it.",
    "The 'cloud' in 'cloud computing' represents the internet, and cloud services store and manage data remotely.",
    "The first computer mouse had only one button because its creator, Douglas Engelbart, thought it was sufficient.",
    "The 'AI winter' refers to periods of reduced funding and interest in artificial intelligence research.",
    "The term 'debugging' originated with Grace Hopper when she removed a moth from a computer relay.",
    "A 'hackathon' is a coding event where programmers collaborate intensively on projects.",
    "The 'NaN' in programming stands for 'Not a Number.'",
    "The first computer programmer in space was a NASA astronaut, John Howard, who wrote code for Apollo missions.",
    "The 'NaN' in programming stands for 'Not a Number.'",
    "The first computer programmer in space was a NASA astronaut, John Howard, who wrote code for Apollo missions.",
    "The Commodore 64, released in 1982, is one of the best-selling personal computers in history.",
    "The 'Hello, World!' program is a traditional way to introduce a programming language to beginners.",
    "The original Apple Macintosh, released in 1984, had only 128KB of RAM.",
    "The term 'bit' is a contraction of 'binary digit.'",
    "The C# programming language, pronounced 'C-sharp,' was developed by Microsoft.",
    "The first video game with recognizable graphics was 'Spacewar!' developed in 1962.",
    "The concept of object-oriented programming was developed in the 1960s but gained popularity in the 1980s.",
    "The first domain name ever registered was 'symbolics.com' on March 15, 1985.",
    "The game 'Pong' was one of the earliest video games and simulated table tennis.",
    "The 'Shift' key on a keyboard was introduced to allow the typewriter mechanism to shift position.",
    "The 'Ctrl' key (Control key) was first introduced on the QWERTY keyboard in the 1960s.",
    "The concept of a 'bug' in a computer system originated from a literal insect – a moth – causing a malfunction.",
    "The Commodore Amiga, released in 1985, was one of the first personal computers with advanced multimedia capabilities.",
    "The acronym 'SQL' stands for 'Structured Query Language.'",
    "The concept of 'open-source' software involves sharing the source code publicly and allowing anyone to modify and distribute it.",
    "The 'cloud' in 'cloud computing' represents the internet, and cloud services store and manage data remotely.",
    "The first computer mouse had only one button because its creator, Douglas Engelbart, thought it was sufficient.",
    "The 'AI winter' refers to periods of reduced funding and interest in artificial intelligence research.",
    "The term 'debugging' originated with Grace Hopper when she removed a moth from a computer relay.",
    "A 'hackathon' is a coding event where programmers collaborate intensively on projects.",
    "The 'NaN' in programming stands for 'Not a Number.'",
    "The first computer programmer in space was a NASA astronaut, John Howard, who wrote code for Apollo missions.",
    // ... (continuing with the list)
  ];

  useEffect(() => {
    setFact(
      programming_facts[Math.floor(Math.random() * programming_facts.length)]
    );

    const params = new URLSearchParams(window.location.search);
    const err = params.get("err");
    if (err === "newlcn") {
      setErr("You have logged in from a new location.");
    } else if (err === "exp") {
      setErr("");
    } else if (err === "max") setErr("Too Many Attempts");
  }, []);

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const mid = document.querySelector("#mid").value;
    const pwd = document.querySelector("#pw").value;
    setMid(mid);

    try {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/`, {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mid: mid.trim(), password: pwd.trim() }),
      })
        .then(async (res) => {
          setIsLoading(false);
          if (res.status === 200) {
            const response = await res.json();
            console.error(response);
            io.emit("onLogin", response.mid);
            localStorage.setItem(
              "chakra-ui-color-mode",
              response?.colorMode ?? "light"
            );

            if (redirectURL !== "/") {
              navigate(redirectURL);
              return;
            } else {
              if (response.role === "A") {
                window.location.href = "/admin";
                Cookie.set("token", response.token, { expires: 1 / 6 });
                Cookie.set("token", response.token, { expires: 1 / 6 });
              } else if (response.role === "F") {
                if (response.firstTime) {
                  setOpen(true);
                } else {
                  Cookie.set("token", response.token, { expires: 1 / 6 });
                  window.location.href = "/faculty";
                }
              } else if (response.role === "S") {
                if (response.firstTime) {
                  setOpen(true);
                } else {
                  Cookie.set("token", response.token, { expires: 1 / 6 });
                  window.location.href = "/";
                }
              }
            }
          } else {
            const response = await res.json();
            setIsLoading(false);
            setAttempts(attempts + 1);
            toast({
              title: response.title,
              description: response.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
          toast({
            title: "An Error Occured.",
            description: "Something Went Wrong!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "An Error Occured.",
        description: "Something Went Wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const detectEnter = (e) => {
    if (e.key === "Enter") {
      if (!disabled) {
        validateAndSubmit(e);
      }
    }
  };

  return (
    <Box className="Auth">
      <Box className="left">
        <Box className="left-inner">
          <Heading>Did You Know?</Heading>
          <Text>{fact}</Text>
          <Text className="creds">A Project by Team Scriptopia</Text>
        </Box>
      </Box>
      <Box className="right">
        <Box className="logos">
          <Image src={APSIT} className="img" draggable="false" />
          <Image src={Logo} className="img" draggable="false" />
        </Box>
        <Box className="title">
          <Heading>Hey, hello 👋</Heading>
          <Text>Sign in with your Moodle ID to Continue</Text>
        </Box>
        <Box>
          <FormLabel>Moodle ID</FormLabel>
          <Input id="mid" />
        </Box>

        <Box>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder=""
              id="pw"
              onKeyUp={(e) => detectEnter(e)}
            />
            <InputRightElement width="4.5rem" marginTop="2px" marginRight="3px">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>

        <Button
          className="btn"
          onClick={validateAndSubmit}
          isLoading={isLoading}
          isDisabled={disabled}
        >
          Login
        </Button>
        <Link onClick={() => navigate("/forgot")}>Forgot Password?</Link>
        <p style={{ color: "red" }}>{err}</p>
      </Box>
      <CreatePW isFirstTime={open} mid={mid} />
    </Box>
  );
};

export default Auth;
