import React, { useEffect } from "react";
import "./Navbar.css";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Logo from "../../assets/img/logo-icon.png";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
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
} from "@chakra-ui/react";

const Navbar = () => {
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
  const [moodle, setMoodle] = React.useState("");

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
      fetch(
        `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/receive`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => {
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
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/add`, {
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
          setNotificationBody("");
          setNotificationExpiry("");
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
      `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/update`,
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
      `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/delete`,
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

  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();

  const resetPassword = () => {
    onResetClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/resetUser`, {
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
    <div className="navAdmin">
      <div className="left-link">
        <div className="image">
          <img src={Logo} onClick={() => navigate("/admin")} />
        </div>

        <Menu>
          <Box className="mobile-menu">
            <MenuButton>Pages</MenuButton>
          </Box>
          <MenuList className="menu">
            <RouterLink to="/admin/students">
              <MenuItem className="menuitem">Students</MenuItem>
            </RouterLink>
            <RouterLink to="/admin/faculty">
              <MenuItem className="menuitem">Faculty</MenuItem>
            </RouterLink>
            <RouterLink to="/houses">
              <MenuItem className="menuitem">Houses</MenuItem>
            </RouterLink>
            <RouterLink to="/events">
              <MenuItem className="menuitem">Events</MenuItem>
            </RouterLink>
            <RouterLink to="/admin/certificates">
              <MenuItem className="menuitem">Certificates</MenuItem>
            </RouterLink>
            <MenuItem onClick={onResetOpen} className="menuitem">
              Reset User Password
            </MenuItem>
          </MenuList>
        </Menu>

        <div className="links">
          <Link onClick={() => navigate("/admin/students")}>Students</Link>
          <Link onClick={() => navigate("/admin/faculty")}>Faculty</Link>
          <Link onClick={() => navigate("/houses")}>Houses</Link>
          <Link onClick={() => navigate("/events")}>Events</Link>
          <Link onClick={() => navigate("/admin/certificates")}>
            Certificates
          </Link>
          <Link onClick={() => navigate("/admin/feedback")}>Platform Feedback</Link>
          <Link onClick={onResetOpen}>Reset User Password</Link>
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
          <Link onClick={() => navigate("/admin/settings")}>
            <MenuItem>Settings</MenuItem>
          </Link>
          {/*}  
          <Link onClick={() => navigate("/admin/profile")}>
            <MenuItem>Profile</MenuItem>
          </Link>
          <MenuDivider />
          {*/}
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody className="drawerbody">
            {notifications?.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No Notifications
              </Alert>
            ) : (
              notifications?.map((notification) => (
                <Alert
                  status="info"
                  key={notification._id}
                  marginBottom="5px"
                  className="notificationBody"
                >
                  <AlertIcon />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <p>{notification.body}</p>
                    <Text
                      _hover={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        updateNotificationOpen(notification._id);
                      }}
                    >
                      Manage
                    </Text>
                  </Box>
                </Alert>
              ))
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onAlertOpen}>
              Add Site Wide Notification
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
              <Box className="alert-navAdmin-notification">
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
              <Box className="alert-navAdmin-notification">
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
