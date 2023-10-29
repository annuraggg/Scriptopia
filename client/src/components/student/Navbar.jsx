import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, Navigate } from "react-router-dom";
import Logo from "../../assets/img/logo-icon.png";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { io as socket } from "../../events/socketConnection";

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
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDialogBody,
  useToast,
  Avatar,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const token = Cookies.get("token");
  const [notifications, setNotifications] = React.useState([]);
  const [picture, setPicture] = React.useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let dec;
    try {
      dec = jwt_decode(token);
      const p = dec.picture;
      setPicture(p);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "Please try again later.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    socket.on("onNotification", async () => {
      try {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/receive`, {
          method: "POST",
          credentials: "include",
        }).then(async (res) => {
          if (res.status === 200) {
            await res.json().then((data) => {
              setNotifications(data.notifications);
            });
          }
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/receive`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 200) {
          await res.json().then((data) => {
            setNotifications(data.notifications);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, []);

  const showSearch = () => {
    document.querySelector("input").style.display = "block";
    document.querySelector("input").style.position = "absolute";
    document.querySelector("input").focus();
  };

  const checkWidth = () => {
    if (window.innerWidth < 768) {
      document.querySelector("input").style.display = "none";
    }
  };

  const logout = () => {
    localStorage.removeItem("chakra-ui-color-mode");
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

  const clearNotifications = () => {
    const notificationIDs = notifications.map((notification) => {
      return notification._id;
    });
    onClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/notifications/clear`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ notificationIDs }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          await res.json().then((data) => {
            setNotifications([]);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <div className="navStudent">
      <div className="left-link">
        <div className="image">
          <img
            src={Logo}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <Menu>
          <Box className="hidden">
            <MenuButton>Pages</MenuButton>
          </Box>
          <MenuList className="menu">
            <Link to="/certificates">
              <MenuItem className="menuitem">Certificates</MenuItem>
            </Link>
            <Link to="/houses">
              <MenuItem className="menuitem">Houses</MenuItem>
            </Link>
            <Link to="/events">
              <MenuItem className="menuitem">Events</MenuItem>
            </Link>
          </MenuList>
        </Menu>
        <div className="links">
          <a onClick={() => navigate("/certificates")}>Certificates</a>
          <a onClick={() => navigate("/houses")}>Houses</a>
          <a onClick={() => navigate("/events")}>Events</a>
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
          {picture ? (
            <MenuButton>
              <Avatar src={picture} size="sm" />{" "}
            </MenuButton>
          ) : (
            <MenuButton>
              <Avatar size="sm" />{" "}
            </MenuButton>
          )}
        </Box>
        <MenuList className="menu">
          <Link to="/settings">
            {" "}
            <MenuItem className="menuitem">Settings</MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem className="menuitem">Profile</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem className="menuitem" onClick={logout}>
            Logout
          </MenuItem>
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
            <Button variant="outline" mr={3} onClick={clearNotifications}>
              Clear All
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Navbar;
