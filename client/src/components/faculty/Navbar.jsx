import React, { useEffect } from "react";
import "./Navbar.css";
import { useNavigate, useNavigation } from "react-router-dom";
import Logo from "../../assets/img/logo-icon.png";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  DrawerContent,
  DrawerHeader,
  Avatar,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Input,
  Button,
  Alert,
  AlertIcon,
  Textarea,
  FormLabel,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
const Navbar = () => {
  const [moodle, setMoodle] = React.useState("");
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const toast = useToast();
  const [notifications, setNotifications] = React.useState([]);
  const [notificationBody, setNotificationBody] = React.useState("");
  const [notificationExpiry, setNotificationExpiry] = React.useState("");
  const [update, setUpdate] = React.useState(false);

  const [updateNotificationBody, setUpdateNotificationBody] =
    React.useState("");
  const [updateNotificationExpiry, setUpdateNotificationExpiry] =
    React.useState("");
  const [updateNotificationId, setUpdateNotificationId] = React.useState("");

  const cancelRef = React.useRef();
  const btnRef = React.useRef();
  const token = Cookies.get("token");
  if (!token) window.location.href = "/auth";
  const decoded = jwt_decode(token);

  const { picture } = decoded;
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/receive`, {
        method: "GET",
        credentials: "include",
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setNotifications(data.notifications);
          });
        }
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Fetching Notifications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [update]);

  const logout = () => {
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN2,
    });
    window.location.href = "/auth";
  };

  const addNotification = () => {
    onAlertClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/Faculty/notifications/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationBody, notificationExpiry }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast({
            title: "Notification Added",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setUpdate(!update);
        } else {
          toast({
            title: "Notification Not Added",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Adding Notification",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const updateNotificationOpen = (id) => {
    const notification = notifications.find(
      (notification) => notification._id === id
    );
    const formattedDate = new Date(notification.expiry);
    const date = formattedDate.toISOString().split("T")[0];
    notification.expiry = date;
    setUpdateNotificationBody(notification.body);
    setUpdateNotificationExpiry(notification.expiry);
    setUpdateNotificationId(id);
    onEditOpen();
  };

  const updateNotification = () => {
    onEditClose();
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/Faculty/notifications/update`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationBody: updateNotificationBody,
          notificationExpiry: updateNotificationExpiry,
          notificationId: updateNotificationId,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast({
            title: "Notification Updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setUpdate(!update);
        } else {
          toast({
            title: "Notification Not Updated",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };

  const deleteNotification = () => {
    onEditClose();
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}  /notifications/delete`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: updateNotificationId }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast({
            title: "Notification Deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setUpdate(!update);
        } else {
          toast({
            title: "Notification Not Deleted",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };

  const resetPassword = () => {
    onResetClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/resetUser`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: moodle }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toast({
            title:
              "Password Reset. Please Ask User to Login with Blank Password",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Password Not Reset",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <div className="navFaculty">
      <div className="left-link">
        <div className="image">
          <img src={Logo} onClick={() => navigate("/faculty")} />
        </div>

        <Menu>
          <Box className="hidden">
            <MenuButton>Pages</MenuButton>
          </Box>
          <MenuList className="menu">
            <Link to="/houses">
              <MenuItem className="menuitem">Houses</MenuItem>
            </Link>
            <Link to="/events">
              <MenuItem className="menuitem">Events</MenuItem>
            </Link>

            {decoded.perms.includes("HCO0" || "HCO1" || "HCO2" || "HCO3") ? (
              <>
                <Link to="/faculty/certificates">
                  <MenuItem className="menuitem">Manage Certificates</MenuItem>
                </Link>
                <Link to="/faculty/enrollments">
                  <MenuItem className="menuitem">Enrollment Requests</MenuItem>
                </Link>
              </>
            ) : null}

            {decoded.perms.includes("RSP") ? (
              <>
                <Link onClick={onResetOpen}>
                  <MenuItem className="menuitem">
                    Reset Student Password
                  </MenuItem>
                </Link>
              </>
            ) : null}

            {decoded.perms.includes("AES") ? (
              <>
                <Link to="/faculty/students">
                  <MenuItem className="menuitem">Manage Students</MenuItem>
                </Link>
              </>
            ) : null}
          </MenuList>
        </Menu>

        <div className="links">
          <ChakraLink onClick={() => navigate("/houses")}>Houses</ChakraLink>
          <ChakraLink onClick={() => navigate("/events")}>Events</ChakraLink>
          {decoded.perms.includes("HCO0" || "HCO1" || "HCO2" || "HCO3") ? (
            <>
              <ChakraLink onClick={() => navigate("/faculty/certificates")}>
                Manage Certificates
              </ChakraLink>
              <ChakraLink onClick={() => navigate("/faculty/enrollments")}>
                Enrollment Requests
              </ChakraLink>
            </>
          ) : null}

          {decoded.perms.includes("RSP") ? (
            <>
              <ChakraLink onClick={onResetOpen}>
                Reset Student Password
              </ChakraLink>
            </>
          ) : null}

          {decoded.perms.includes("AES") ? (
            <>
              <ChakraLink onClick={() => navigate("/faculty/students")}>
                Manage Students
              </ChakraLink>
            </>
          ) : null}
        </div>
      </div>

      <Menu>
        <Box className="rightmost">
          <i
            className="fa-sharp fa-solid fa-bell"
            style={{ color: "gray" }}
            ref={btnRef}
            onClick={onOpen}
          ></i>{" "}
          <MenuButton>
            <Avatar src={picture} size="sm" />{" "}
          </MenuButton>
        </Box>
        <MenuList>
          <ChakraLink onClick={() => navigate("/faculty/settings")}>
            <MenuItem>Settings</MenuItem>
          </ChakraLink>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="drawer-studentNav">
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody className="drawerbody">
            {notifications.length === 0 ? (
              <Alert>
                <AlertIcon />
                No Notifications
              </Alert>
            ) : (
              notifications.map((notification) => (
                <Alert status="info" key={notification._id} marginBottom="5px">
                  <AlertIcon />

                  <AlertDialogBody width="100%">
                    {notification.body}
                  </AlertDialogBody>
                </Alert>
              ))
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Clear All
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Site Wide Notification
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box className="alert-navFaculty-notification">
                <Textarea
                  placeholder="Enter Notification Here"
                  resize="none"
                  size="lg"
                  onChange={(e) => setNotificationBody(e.target.value)}
                  value={notificationBody}
                />
                <Box>
                  <FormLabel fontSize="sm">Expiry</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => setNotificationExpiry(e.target.value)}
                    value={notificationExpiry}
                  />
                </Box>
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={addNotification} ml={3}>
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isEditOpen}
        leastDestructiveRef={cancelRef}
        onClose={onEditClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update Site Wide Notification
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box className="alert-navFaculty-notification">
                <Textarea
                  placeholder="Enter Notification Here"
                  resize="none"
                  size="lg"
                  onChange={(e) => setUpdateNotificationBody(e.target.value)}
                  value={updateNotificationBody}
                />
                <Box>
                  <FormLabel fontSize="sm">Expiry</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setUpdateNotificationExpiry(e.target.value)
                    }
                    value={updateNotificationExpiry}
                  />
                </Box>
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onEditClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteNotification} ml={3}>
                Delete
              </Button>
              <Button colorScheme="green" onClick={updateNotification} ml={3}>
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isResetOpen}
        leastDestructiveRef={cancelRef}
        onClose={onResetClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset User Password
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb="20px">
                Enter Moodle ID of User to Reset Password Of
              </Text>
              <Input
                type="text"
                placeholder="Moodle ID"
                width="20vw"
                value={moodle}
                onChange={(e) => setMoodle(e.target.value)}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onResetClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={resetPassword} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Navbar;
