import React, { useEffect, useState } from "react";
import "./Students.css";
import {
  Box,
  FormLabel,
  Input,
  Select,
  Table,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import Navbar from "../../../components/admin/Navbar";
import Breadcrumb from "../../../components/Breadcrumb";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Students = () => {
  useAuthCheck("A");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [houses, setHouses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenBulk,
    onOpen: onOpenBulk,
    onClose: onCloseBulk,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [moodleid, setMoodleid] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [house, setHouse] = React.useState("");
  const [gender, setGender] = React.useState("male");

  const [update, setUpdate] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const [deleteArr, setDeleteArr] = useState([]);

  const toast = useToast();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setStudents(data.students);
        setHouses(data.houses);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error fetching students",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [update]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    students.forEach((student) => {
      student.academicYear = currentYear - student.year + 1;

      if (student.dse) {
        student.academicYear += 1;
      }

      if (student.academicYear > 4) {
        student.academicYear = "Alumini";
      }
    });
  }, [students]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        (selectedYear === "all" || student.academicYear == selectedYear) &&
        (selectedHouse === "all" || student.houseID === selectedHouse) &&
        Object.values(student).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students, selectedYear, selectedHouse]);

  const openEdit = (mid) => {
    onEditOpen();
    const student = students.find((stu) => stu.mid === mid);

    const fName = student.name.split(" ")[0];
    const lName = student.name.split(" ")[1];

    setFname(fName);
    setLname(lName);
    setMoodleid(student.mid);
    setEmail(student.email);
    setHouse(student.houseID);
    setGender(student.gender);
    onEditOpen();
  };

  const updateStudent = () => {
    onEditClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students/update`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mid: moodleid,
        fName: fname,
        lName: lname,
        email: email,
        house: house,
        gender: gender,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: "Student Updated Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUpdate(!update);
        }
      });
  };

  const openDelete = (mid) => {
    setDeleteID(mid);
    onOpen();
  };

  const deleteStudent = () => {
    onClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: deleteID }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: "Student Deleted Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUpdate(!update);
        }
      });
  };

  const handleCheckboxChange = (event, studentMid) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setDeleteArr([...deleteArr, studentMid]);
      if (deleteArr.length === filteredStudents.length - 1) {
        setSelectAll(true);
      }
    } else {
      setDeleteArr(deleteArr.filter((mid) => mid !== studentMid));
      setSelectAll(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setDeleteArr([]);
    } else {
      setDeleteArr(filteredStudents.map((student) => student.mid));
    }

    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (
      deleteArr.length === filteredStudents.length ||
      filteredStudents.length < deleteArr.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [filteredStudents]);

  const handleBulkDelete = () => {
    onCloseBulk();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students/bulkdelete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mids: deleteArr }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: "Students Deleted Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUpdate(!update);
          setDeleteArr([]);
        }
      });
  };

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Breadcrumb
          title="Students"
          links={[
            { href: "/admin", name: "Admin" },
            { href: "/students", name: "Students" },
          ]}
          relatedLinks={[{ href: "/admin/students/add", name: "Add Students" }]}
        />
        <Box className="AdminStudents-Admin">
          <Box className="filters">
            <Box className="filters">
              <Box className="ipgroup">
                <FormLabel>Search</FormLabel>
                <Input
                  placeholder="Search By Any Term"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>

              <Box className="ipgroup">
                <FormLabel>Select Year</FormLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </Select>
              </Box>

              <Box className="ipgroup">
                <FormLabel>Select House</FormLabel>
                <Select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                >
                  <option value="all">All</option>
                  {houses.map((house) => (
                    <option value={house._id} key={house._id}>
                      {house.name}
                    </option>
                  ))}
                </Select>
              </Box>
              {deleteArr.length > 0 && (
                <Box className="ipgroup" marginLeft="50px">
                  <FormLabel>Actions</FormLabel>
                  <Button colorScheme="red" onClick={onOpenBulk}>
                    Bulk Delete
                  </Button>
                </Box>
              )}
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
                  <Th>
                    <Checkbox
                      isChecked={selectAll}
                      onChange={toggleSelectAll}
                    ></Checkbox>
                  </Th>
                  <Th>Moodle ID</Th>
                  <Th>Name</Th>
                  <Th>Admission Year</Th>
                  <Th>Academic Year</Th>
                  <Th>Email</Th>
                  <Th>House</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.map((student, index) => (
                  <Tr key={student.mid}>
                    <Td>
                      <Checkbox
                        value={student.mid}
                        isChecked={selectAll || deleteArr.includes(student.mid)}
                        onChange={(event) =>
                          handleCheckboxChange(event, student.mid)
                        }
                      />
                    </Td>
                    <Td>{student.mid}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.year}</Td>
                    <Td>{student.academicYear}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.house}</Td>
                    <Td>
                      <Box className="actions">
                        <Box
                          className="action"
                          _hover={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            openEdit(student.mid);
                          }}
                        >
                          Edit
                        </Box>
                        <Box
                          className="action"
                          _hover={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            openDelete(student.mid);
                          }}
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

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Student
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deleteStudent()}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isOpenBulk}
          leastDestructiveRef={cancelRef}
          onClose={onCloseBulk}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Bulk Delete Students
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards. All
                Selected Students will be Deleted
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseBulk}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleBulkDelete()}
                  ml={3}
                >
                  Delete All
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            <ModalHeader>Update Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box className="StudentModal">
                <Box className="flex">
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={fname}
                    onChange={(e) => {
                      setFname(e.target.value);
                    }}
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </Box>
                <Input
                  type="text"
                  placeholder="Moodle ID"
                  value={moodleid}
                  onChange={(e) => setMoodleid(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Select
                  placeholder="Select a House"
                  onChange={(e) => setHouse(e.target.value)}
                  value={house}
                >
                  {houses.map((house) => (
                    <option value={house._id} key={house._id}>
                      {house.name}
                    </option>
                  ))}
                </Select>

                <RadioGroup onChange={setGender} value={gender}>
                  <Stack direction="row">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                    <Radio value="others">Others</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onEditClose}>
                Close
              </Button>
              <Button colorScheme="green" onClick={updateStudent}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default Students;
