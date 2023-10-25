import React, { useEffect, useState } from "react";
import "./Faculty.css";
import {
  Box,
  Button,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  AlertDialog,
  useToast,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  ModalCloseButton,
  Thead,
  Tr,
  Flex,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  List,
  ListItem,
  ListIcon,
  useRadioGroup,
} from "@chakra-ui/react";
import Navbar from "../../../components/admin/Navbar";
import Breadcrumb from "../../../components/Breadcrumb";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";
import { CheckCircleIcon } from "@chakra-ui/icons";

const Faculty = () => {
  useAuthCheck("A");
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaculty, seFilteredFaculty] = useState([]);
  const [houses, setHouses] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const {
    isOpen: isPermsOpen,
    onOpen: onPermsOpen,
    onClose: onPermsClose,
  } = useDisclosure();

  const [delItem, setDelItem] = useState({});
  const [mid, setMid] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [facOID, setFacOID] = useState("");

  const [perms, setPerms] = React.useState([]);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelDeleteRef = React.useRef();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty`, {
      // ! CHANGE TO FACULTY
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setFaculty(data.faculty);
        setHouses(data.houses);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error fetching faculty",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [searchQuery]);

  useEffect(() => {
    const filtered = faculty.filter((faculty) =>
      Object.values(faculty).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    seFilteredFaculty(filtered);
  }, [searchQuery, faculty]);

  const deleteCustomer = (id) => {
    setDelItem(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mid: delItem,
      }),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.success) {
          onDeleteClose();
          setSearchQuery("");
          toast({
            title: "Success",
            description: "Faculty deleted successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location.reload();
        } else {
          onDeleteClose();
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const openEdit = (id) => {
    onOpen();
    const faculty = filteredFaculty.find((faculty) => faculty.mid === id);
    setMid(faculty.mid);
    setFname(faculty.fname);
    setLname(faculty.lname);
    setEmail(faculty.email);
    setGender(faculty.gender);
    setFacOID(faculty.id);
    setPerms(faculty.perms);
  };

  const updateFaculty = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/update`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: facOID,
        mid: mid,
        fname: fname,
        lname: lname,
        email: email,
        gender: gender,
        perms: perms,
      }),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.success) {
          onClose();
          setSearchQuery("");
          toast({
            title: "Success",
            description: "Faculty updated successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location.reload();
        } else {
          onClose();
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        onClose();
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Breadcrumb
          title="Faculty"
          links={[
            { href: "/admin", name: "Admin" },
            { href: "/admin/faculty", name: "Faculty" },
          ]}
          relatedLinks={[{ href: "/admin/faculty/add", name: "Add Faculty" }]}
        />
        <Box className="AdminStudents">
          <Box className="filters">
            <Box className="filters">
              <Box className="ipgroup">
                <FormLabel>Search</FormLabel>
                <Input
                  placeholder="Search By Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr
                  position="sticky"
                  top="0px"
                  className="tabletop"
                  zIndex="sticky"
                  backgroundColor="#F7F6FA"
                >
                  <Th>Moodle ID</Th>
                  <Th>Name</Th>
                  <Th>Branch</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFaculty.map((faculty) => (
                  <Tr key={faculty.mid}>
                    <Td>{faculty.mid}</Td>
                    <Td>
                      {faculty.fname} {faculty.lname}
                    </Td>
                    <Td>IT</Td>
                    <Td>
                      <Box className="actions">
                        <Box
                          className="action"
                          cursor="pointer"
                          onClick={() => openEdit(faculty.mid)}
                        >
                          Edit
                        </Box>
                        <Box
                          className="action"
                          cursor="pointer"
                          onClick={() => deleteCustomer(faculty.mid)}
                        >
                          Delete
                        </Box>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            <ModalHeader>Edit Faculty</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box className="form">
                <Box className="ipgroup">
                  <FormLabel>Faculty Moodle ID</FormLabel>
                  <Input
                    placeholder="Faculty ID"
                    value={mid}
                    onChange={(e) => setMid(e.target.value)}
                  />
                </Box>
                <Flex gap="20px" mt="10px">
                  <Box className="ipgroup">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder="First Name"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                    />
                  </Box>
                  <Box className="ipgroup">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder="Last Name"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </Box>
                </Flex>
                <Box className="ipgroup" mt="10px">
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>

                <Box className="ipgroup" mt="10px">
                  <FormLabel>Gender</FormLabel>

                  <RadioGroup
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <Flex gap="20px">
                      <Radio name="gender" value="Male">
                        Male
                      </Radio>
                      <Radio name="gender" value="Female">
                        Female
                      </Radio>
                      <Radio name="gender" value="Others">
                        Others
                      </Radio>
                    </Flex>
                  </RadioGroup>
                </Box>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  onPermsOpen();
                }}
                colorScheme="red"
                mr={3}
              >
                Configure Permissions
              </Button>
              <Button variant="ghost" onClick={() => updateFaculty(facOID)}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Faculty
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Modal
          isOpen={isPermsOpen}
          onClose={onPermsClose}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            <ModalHeader>Faculty Permissions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <Table>
                  <Tbody>
                    <CheckboxGroup value={perms} onChange={(e) => setPerms(e)}>
                      <Tr>
                        <Td>
                          <Checkbox value="MHI">Manage Events</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Create Events
                            </ListItem>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Update Events
                            </ListItem>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Manage / Edit Events
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      {houses.map((house, index) => (
                        <Tr key={index}>
                          <Td>
                            <Checkbox value={`HCO${index}`}>House Coordinator - {house}</Checkbox>
                          </Td>
                          <Td>
                            <List>
                              <ListItem mb={2}>
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                />
                                Manage House Profile
                              </ListItem>
                              <ListItem>
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                />
                                Manage House Members
                              </ListItem>
                            </List>
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td>
                          <Checkbox value="SND">Send Notifications</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Send Global Notifications to Users
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      {}
                      <Tr>
                        <Td>
                          <Checkbox value="RSP">
                            Reset Student Password
                          </Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Assist in resetting student passwords when
                              necessary
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Checkbox value="AES">Add/Edit Student</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Add Students to the system
                            </ListItem>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Delete Students from the system
                            </ListItem>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Edit Student Profiles
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                    </CheckboxGroup>
                  </Tbody>
                </Table>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="green"
                onClick={() => {
                  onPermsClose();
                  onOpen();
                }}
              >
                Set
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default Faculty;
