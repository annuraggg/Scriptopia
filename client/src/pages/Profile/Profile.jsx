import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import StudentNav from "../../components/student/Navbar";
import AdminNav from "../../components/admin/Navbar";
import FacultyNav from "../../components/faculty/Navbar";
import GuestNav from "../../components/guest/Navbar";
import {
  Avatar,
  Box,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Link,
  Table,
  Thead,
  Tr,
  Td,
  useToast,
  Tbody,
  InputLeftAddon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import Chart from "chart.js/auto";
import Loader from "../../components/Loader";
import AvatarEditor from "react-avatar-editor";

const Profile = () => {
  const [privilege, setPrivilege] = useState(false);
  const [profile, setProfile] = useState([]);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [update, setUpdate] = useState(false);

  const newImageRef = React.useRef(null);

  const toast = useToast();

  const [user, setUser] = useState();
  const [houses, setHouses] = useState();
  const [userHouse, setUserHouse] = useState();
  const [certifications, setCertifications] = useState();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [hp, setHp] = useState(0);
  const [firstTime, setFirstTime] = useState(false);

  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [mid, setMid] = useState("");
  const [newImage, setNewImage] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);

  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const token = Cookies.get("token");
    let jwt;
    try {
      if (token) {
        if (user) {
          jwt = jwtDecode(token);
          if (jwt?.mid === user?.mid) {
            setPrivilege(true);
            setMid(jwt?.mid);
            console.log(jwt);
          } else {
            setPrivilege(false);
          }
        }
      }
    } catch (error) {
      setPrivilege(false);
    }
  }, [loading, user]);

  function calculateTotalPoints(data) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // Get the current year

    let totalInternalPoints = 0;
    let totalExternalPoints = 0;
    let totalEventsPoints = 0;

    if (data && data.points && data.points[currentYear?.toString()]) {
      const monthlyPoints = data.points[currentYear?.toString()];
      for (const month in monthlyPoints) {
        if (monthlyPoints.hasOwnProperty(month)) {
          // Separate internal, external, and events points
          const { internal, external, events } = monthlyPoints[month];

          // Add them to their respective totals
          totalInternalPoints += internal;
          totalExternalPoints += external;
          totalEventsPoints += events;
        }
      }
    }

    setTotalPoints(
      totalInternalPoints + totalExternalPoints + totalEventsPoints
    );

    return {
      totalInternal: totalInternalPoints,
      totalExternal: totalExternalPoints,
      totalEvents: totalEventsPoints,
    };
  }

  useEffect(() => {
    let id = window.location.href.split("/").slice(4)[0];
    if (!id) {
      try {
        const token = Cookies.get("token");
        const jwt = jwtDecode(token);
        id = jwt.mid;
      } catch {
        console.error("Error");
        toast({
          title: "Error",
          description: "Error fetching profile data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHouses(data.allHouses);
        setUserHouse(data.userHouse);
        setCertifications(data.certifications);
        setFirstTime(data.user.firstTime);
        setLoading(false);
        setEmail(data.user.email);
        setLinkedin(data.user.linkedin);
        setGithub(data.user.github);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error fetching dashboard data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [update]);

  useEffect(() => {
    let cont;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear?.toString();

    if (!loading) {
      const sepPoints = calculateTotalPoints(user.house);
      const totalPoints =
        sepPoints.totalInternal +
        sepPoints.totalExternal +
        sepPoints.totalEvents;

      const sephousePoints = calculateTotalPoints(userHouse);
      const housePoints =
        sephousePoints.totalInternal +
        sephousePoints.totalExternal +
        sephousePoints.totalEvents;

      cont = document.getElementById("contribution");
      const contrChart = new Chart(cont, {
        type: "doughnut",
        data: {
          labels: [
            "Your House",
            "Internal Certification Points",
            "External Certification Points",
            "Events Certification Points",
          ],
          datasets: [
            {
              label: "Points",
              data: [
                housePoints - totalPoints,
                sepPoints.totalInternal,
                sepPoints.totalExternal,
                sepPoints.totalEvents,
              ],
              backgroundColor: ["#3e95cd", "#ffb6c1", "#9370db", "#87ceeb"],
              borderColor: ["#3e95cd", "#ffb6c1", "#9370db", "#87ceeb"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => {
        if (contrChart) {
          contrChart.destroy();
        }
      };
    }

    return () => {
      if (cont) {
        contrChart.destroy();
      }
    };
  }, [loading, userHouse, user]);

  useEffect(() => {
    const token = Cookies.get("token");
    let jwt;
    if (token) {
      jwt = jwtDecode(token);
      setRole(jwt.role);
    }
  }, []);

  useEffect(() => {
    function hexToRgba(hex, opacity) {
      // Remove the hash character (#) if present
      hex = hex.replace(/^#/, "");

      // Parse the hex color into RGB components
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      // Create and return the RGBA color
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear?.toString();

    let myHouseChart;
    let myHouse;

    if (!loading && userHouse) {
      const jan =
        (userHouse.points[currentYear?.toString()]?.["january"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["january"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["january"]?.events ?? 0);
      const feb =
        (userHouse.points[currentYear?.toString()]?.["february"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["february"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["february"]?.events ?? 0);
      const mar =
        (userHouse.points[currentYear?.toString()]?.["march"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["march"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["march"]?.events ?? 0);
      const apr =
        (userHouse.points[currentYear?.toString()]?.["april"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["april"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["april"]?.events ?? 0);
      const may =
        (userHouse.points[currentYear?.toString()]?.["may"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["may"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["may"]?.events ?? 0);
      const jun =
        (userHouse.points[currentYear?.toString()]?.["june"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["june"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["june"]?.events ?? 0);
      const jul =
        (userHouse.points[currentYear?.toString()]?.["july"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["july"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["july"]?.events ?? 0);
      const aug =
        (userHouse.points[currentYear?.toString()]?.["august"]?.internal ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["august"]?.external ?? 0) +
        (userHouse.points[currentYear?.toString()]?.["august"]?.events ?? 0);
      const sep =
        (userHouse.points[currentYear?.toString()]?.["september"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["september"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["september"]?.events ?? 0);
      const oct =
        (userHouse.points[currentYear?.toString()]?.["october"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["october"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["october"]?.events ?? 0);
      const nov =
        (userHouse.points[currentYear?.toString()]?.["november"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["november"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["november"]?.events ?? 0);
      const dec =
        (userHouse.points[currentYear?.toString()]?.["december"]?.internal ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["december"]?.external ??
          0) +
        (userHouse.points[currentYear?.toString()]?.["december"]?.events ?? 0);

      myHouse = document.getElementById("graph");
      myHouseChart = new Chart(myHouse, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Points",
              data: [
                jan,
                feb,
                mar,
                apr,
                may,
                jun,
                jul,
                aug,
                sep,
                oct,
                nov,
                dec,
              ],
              tension: 0.3,
              borderColor: houses[0].color,
              fill: true,
              backgroundColor: hexToRgba(houses[1].color, 0.25),
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: { color: "#f2f2f2", display: false },
            },
            y: {
              grid: { color: "#f2f2f2", display: false },
              ticks: {
                display: false,
              },
              border: {
                display: false,
              },
            },
          },
        },
      });
    }

    return () => {
      if (myHouseChart) {
        myHouseChart.destroy();
      }
    };
  }, [loading]);

  const changeEmail = (e) => {
    setEmail(e.target.value);
    console.log("<ID");
    console.log(mid);

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (e.key === "Enter") {
      if (!validateEmail(email)) {
        toast({
          title: "Invalid Email",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Email Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const changeLinkedin = (e) => {
    setLinkedin(e.target.value);

    const isLinkedInURL = (url) => {
      const linkedInPattern =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/i;
      return linkedInPattern.test(url);
    };

    if (e.key === "Enter") {
      if (!isLinkedInURL(e.target.value)) {
        toast({
          title: "Invalid Linkedin URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const url = new URL(e.target.value);
      } catch (_) {
        console.log(_);
        toast({
          title: "Invalid Github URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Linkedin Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const changeGithub = (e) => {
    setGithub(e.target.value);

    const isGitHubURL = (url) => {
      const githubPattern =
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+$/i;
      return githubPattern.test(url);
    };

    if (e.key === "Enter") {
      if (!isGitHubURL(e.target.value)) {
        toast({
          title: "Invalid URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Github Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const selectImage = () => {
    document.getElementById("file").click();
  };

  const openInAvatarEditor = (e) => {
    const image = e.target.files[0];
    if (!image) {
      return;
    }

    setNewImage(image);
    onOpen();
  };

  const uploadImage = async () => {
    setBtnLoading(true);
    const image = await newImageRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/png");

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/updatepfp`, {
      method: "POST",
      credentials: "include",
      body: image,
    })
      .then((res) => {
        setBtnLoading(false);
        if (res.status === 200) {
          toast({
            title: "Profile Picture Updated Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
          setUpdate(!update);
          window.location.reload();
        } else {
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        setBtnLoading(false);
        console.error(err);
        toast({
          title: "Error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const closeModal = () => {
    onClose();
    newImageRef.current.image = null;
  };

  if (!loading) {
    return (
      <>
        {role === "S" ? (
          <StudentNav />
        ) : role === "A" ? (
          <AdminNav />
        ) : role === "F" ? (
          <FacultyNav />
        ) : (
          <GuestNav />
        )}

        <Flex gap="20px" className="StudentProfile">
          <Heading>{privilege}</Heading>
          <Box width="300vw">
            <Flex
              p="20px"
              direction="column"
              gap="20px"
              align="center"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              borderRadius="15px"
              width="100%"
            >
              <Box className="pfp">
                <Avatar
                  size="2xl"
                  src={user.profilePicture}
                  className={privilege ? "original" : null}
                />
                {privilege ? (
                  <Flex
                    onClick={selectImage}
                    align="center"
                    justify="center"
                    cursor="pointer"
                    width="100%"
                    height="100%"
                    borderRadius="50%"
                    className={privilege ? "overlay" : null}
                    bg="black"
                  >
                    <i
                      className="fa-solid fa-pen"
                      style={{ fontSize: "20px", color: "white" }}
                    ></i>
                  </Flex>
                ) : null}
              </Box>
              <Input
                type="file"
                id="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={openInAvatarEditor}
              />

              <Text>
                {user?.fname} {user?.lname}
              </Text>
              <Text>{user?.mid}</Text>

              <Flex gap="20px">
                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>{user?.certificates?.internal ?? 0}</Text>
                    <Text fontSize="13px">Internal Certificates</Text>
                  </Flex>
                </Box>

                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>{user?.certificates?.external ?? 0}</Text>
                    <Text fontSize="13px">External Certificates</Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                <Flex direction="column" align="center" justify="center">
                  <Text>{user?.certificates?.event ?? 0}</Text>
                  <Text fontSize="13px">Events Certificates</Text>
                </Flex>
              </Box>
            </Flex>

            {privilege ? (
              <Flex
                direction="column"
                gap="15px"
                mt="20px"
                boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                borderRadius="15px"
                p="20px"
                height="29.6vh"
              >
                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-solid fa-envelopes"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    direction="row"
                    type="email"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.email}
                    onKeyUp={changeEmail}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-brands fa-linkedin"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    type="url"
                    direction="row"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.linkedin}
                    onKeyUp={changeLinkedin}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-brands fa-github"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    direction="row"
                    type="url"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.github}
                    onKeyUp={changeGithub}
                  />
                </InputGroup>
              </Flex>
            ) : (
              <Flex
                direction="column"
                gap="15px"
                mt="20px"
                boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                borderRadius="15px"
                p="20px"
                height="29.6vh"
              >
                <Flex
                  gap="10px"
                  direction="row"
                  align="center"
                  border="1px solid lightgray"
                  padding="8px"
                  borderRadius="5px"
                >
                  <i className="fa-solid fa-envelopes"></i>
                  <Link href={"mailto:" + user?.email} target="_blank">
                    {user?.email}
                  </Link>
                </Flex>

                <Flex
                  gap="10px"
                  direction="row"
                  align="center"
                  border="1px solid lightgray"
                  padding="8px"
                  borderRadius="5px"
                >
                  <i className="fa-brands fa-linkedin"></i>
                  <Link href={user?.linkedin} target="_blank">
                    {user?.linkedin}
                  </Link>
                </Flex>
                <Flex
                  gap="10px"
                  direction="row"
                  align="center"
                  border="1px solid lightgray"
                  padding="8px"
                  borderRadius="5px"
                >
                  <i className="fa-brands fa-github"></i>
                  <Link target="_blank" href={user?.github}>
                    {user?.github}
                  </Link>
                </Flex>
              </Flex>
            )}
          </Box>

          <Flex direction="column" gap="20px">
            <Box height="fit-content" gap="20px">
              <Flex width="65vw" gap="20px" className="graphs">
                <Box
                  height="41.5vh"
                  minHeight="fit-content"
                  p="20px"
                  borderRadius="15px"
                  boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                  width="50%"
                  className="graphs"
                >
                  <Heading fontSize="17px" mb="50px">
                    House Contribution
                  </Heading>
                  <Flex
                    align="center"
                    justify="center"
                    height="60%"
                    gap="20px"
                    direction="column"
                  >
                    <canvas
                      id="contribution"
                      width="10px"
                      height="10px"
                    ></canvas>
                  </Flex>
                </Box>

                <Box
                  height="41.5vh"
                  minHeight="fit-content"
                  borderRadius="15px"
                  boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                  p="0px 10px"
                  pb="30px"
                  width="80vw"
                  className="graphs"
                >
                  <Heading p="20px" pb="0" fontSize="17px" mb="50px">
                    Contribution Graph
                  </Heading>

                  <Flex
                    align="center"
                    justify="center"
                    height="70%"
                    gap="20px"
                    direction="column"
                  >
                    <canvas id="graph"></canvas>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            <Box
              width="100%"
              height="41.5vh"
              minHeight="fit-content"
              borderRadius="15px"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              p="20px"
              overflowY="auto"
              className="table"
            >
              <Table>
                <Thead>
                  <Tr>
                    <Td>Sr. No</Td>
                    <Td>Certificate Name</Td>
                    <Td>Issuing Org.</Td>
                    <Td>Type</Td>
                    <Td>Issue Date</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {certifications.map((certification, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{certification?.certificateName}</Td>
                      <Td>{certification?.issuingOrg}</Td>
                      <Td>{certification?.certificateType}</Td>
                      <Td>
                        {certification?.issueMonth} {certification.issueYear}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            <ModalHeader>Upload Picture</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex
                align="center"
                justify="center"
                direction="column"
                gap="50px"
              >
                <AvatarEditor
                  image={newImage}
                  width={200}
                  height={200}
                  border={50}
                  borderRadius={100}
                  color={[0, 0, 0, 0.6]} // RGBA
                  scale={zoom}
                  rotate={0}
                  className="avatar-editor"
                  ref={newImageRef}
                />
                <Box width="100%">
                  <Text textAlign="center">Zoom</Text>
                  <Slider
                    aria-label="slider-ex-1"
                    min={1.2}
                    value={zoom}
                    onChange={setZoom}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                isLoading={btnLoading}
                onClick={uploadImage}
              >
                Set
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Profile;
