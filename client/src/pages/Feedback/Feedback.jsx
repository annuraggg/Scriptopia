import {
  Box,
  Button,
  Flex,
  Heading,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  const handleRating = (e) => {
    setRating(e.target.value);
    console.log(e.target.value);
  };

  const sendFeedback = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/feedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, review: wfeedback }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Feedback Submitted",
            description: "Your feedback has been submitted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      direction="column"
      gap="30px"
    >
      <Heading>{import.meta.env.VITE_APP_NAME} Feedback</Heading>
      <div className="rate">
        <input
          type="radio"
          id="star5"
          name="rate"
          value="5"
          onChange={handleRating}
        />
        <label htmlFor="star5" title="text">
          5 stars
        </label>
        <input
          type="radio"
          id="star4"
          name="rate"
          value="4"
          onChange={handleRating}
        />
        <label htmlFor="star4" title="text">
          4 stars
        </label>
        <input
          type="radio"
          id="star3"
          name="rate"
          value="3"
          onChange={handleRating}
        />
        <label htmlFor="star3" title="text">
          3 stars
        </label>
        <input
          type="radio"
          id="star2"
          name="rate"
          value="2"
          onChange={handleRating}
        />
        <label htmlFor="star2" title="text">
          2 stars
        </label>
        <input
          type="radio"
          id="star1"
          name="rate"
          value="1"
          onChange={handleRating}
        />
        <label htmlFor="star1" title="text">
          1 star
        </label>
      </div>

      <Textarea
        placeholder="Describe Your Issue / Problem / Feedback in this space"
        width="40vw"
        variant="filled"
        resize="none"
        rows="10"
        onChange={(e) => setFeedback(e.target.value)}
        value={feedback}
      ></Textarea>
      <Button colorScheme="teal" variant="solid" onClick={sendFeedback}>
        Submit Feedback
      </Button>
    </Flex>
  );
};

export default Feedback;
