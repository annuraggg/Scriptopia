import React, { useEffect, useState } from "react";
import Navbar from "../../../components/admin/Navbar";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import "./Feedback.css";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Feedback = () => {
  useAuthCheck("A");
  const [feedback, setFeedback] = useState([""]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/feedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res
        .json()
        .then((data) => {
          setFeedback((prevFeedback) => [...prevFeedback, ...data.result]);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error",
            description: "Error fetching feedback",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    });
  }, []);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box p="30px 70px">
          <Flex
            p="30px 70px"
            gap="20px"
            mt="50px"
            justifyContent="center"
            flexWrap="wrap"
          >
            {feedback.length > 0 ? (
              feedback?.map((item, index) =>
                index === 0 ? (
                  <Box key={index}></Box>
                ) : (
                  <Card
                    minW="300px"
                    maxW="300px"
                    h="xs"
                    className="card"
                    key={index}
                    overflowY="auto"
                  >
                    <CardBody>
                      <Text>Rating: {item.rating}</Text>
                      <Text>Review: {item.review}</Text>
                    </CardBody>
                  </Card>
                )
              )
            ) : (
              <Text>No feedback yet</Text>
            )}
          </Flex>
        </Box>
      </>
    );
  } else return <Loader />;
};

export default Feedback;
