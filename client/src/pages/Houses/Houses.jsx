import React, { useEffect, useState } from "react";
import Navbar from "../../components/student/Navbar";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import AdminNavbar from "../../components/admin/Navbar";
import FacultyNavbar from "../../components/faculty/Navbar";
import GuestNavbar from "../../components/guest/Navbar";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Loader from "../../components/Loader";
import "./Houses.css";

const Houses = () => {
  const toast = useToast();
  const [role, setRole] = useState("G");
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentYear, setCurrentYear] = useState(0);
  const [prevMonth, setPrevMonth] = useState(0);

  useEffect(() => {
    const token = Cookies.get("token");
    try {
      const jwt = jwtDecode(token);
      if (jwt) {
        setRole(jwt.role);
      }
    } catch (err) {
      return;
    }
  }, []);

  useEffect(() => {
    const monthNames = [
      "all",
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    setSelectedMonth(monthNames[currentMonth + 1]);
    setPrevMonth(monthNames[currentMonth]);

    console.error(monthNames[currentMonth + 1]);

    const currentYear = currentDate.getFullYear();
    setCurrentYear(currentYear);
  }, []);

  function calculateTotalPoints(data) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // Get the current year

    let totalInternalPoints = 0;
    let totalExternalPoints = 0;
    let totalEventsPoints = 0;

    if (data && data.points && data.points[currentYear.toString()]) {
      const monthlyPoints = data.points[currentYear.toString()];
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

    return {
      totalInternal: totalInternalPoints,
      totalExternal: totalExternalPoints,
      totalEvents: totalEventsPoints,
    };
  }

  useEffect(() => {
    let hcl;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    if (!loading) {
      let house1, house2, house3, house4;
      if (selectedMonth === "all") {
        house1 = calculateTotalPoints(houses[0]);
        house2 = calculateTotalPoints(houses[1]);
        house3 = calculateTotalPoints(houses[2]);
        house4 = calculateTotalPoints(houses[3]);

        house1 =
          house1.totalInternal + house1.totalExternal + house1.totalEvents;
        house2 =
          house2.totalInternal + house2.totalExternal + house2.totalEvents;
        house3 =
          house3.totalInternal + house3.totalExternal + house3.totalEvents;
        house4 =
          house4.totalInternal + house4.totalExternal + house4.totalEvents;
      } else {
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        currentYear = currentYear.toString();

        house1 = houses[0].points[2023][selectedMonth];
        house2 = houses[1].points[2023][selectedMonth];
        house3 = houses[2].points[2023][selectedMonth];
        house4 = houses[3].points[2023][selectedMonth];

        house1 = house1.internal + house1.external + house1.events;
        house2 = house2.internal + house2.external + house2.events;
        house3 = house3.internal + house3.external + house3.events;
        house4 = house4.internal + house4.external + house4.events;
      }

      const houseLeaderboard = document.getElementById("monthly");
      hcl = new Chart(houseLeaderboard, {
        type: "bar",
        data: {
          labels: [
            houses[0].name,
            houses[1].name,
            houses[2].name,
            houses[3].name,
          ],
          datasets: [
            {
              label: "Points",
              data: [house1, house2, house3, house4],
              backgroundColor: [
                houses[0].color,
                houses[1].color,
                houses[2].color,
                houses[3].color,
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 0,
              borderRadius: 10
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
              ticks: {
                display: true,
                major: true,
              },
              border: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
            },
          },
        },
      });
    }

    return () => {
      if (hcl) {
        hcl?.destroy();
      }
    };
  }, [loading, selectedMonth]);

  useEffect(() => {
    let hcl;
    const currentDate = new Date();
    let currentYear = currentDate?.getFullYear();
    currentYear = currentYear?.toString();

    if (!loading) {
      let house1, house2, house3, house4;
      if (selectedMonth === "all") {
        house1 = calculateTotalPoints(houses[0]);
        house2 = calculateTotalPoints(houses[1]);
        house3 = calculateTotalPoints(houses[2]);
        house4 = calculateTotalPoints(houses[3]);

        house1 =
          house1?.totalInternal + house1?.totalExternal + house1?.totalEvents;
        house2 =
          house2?.totalInternal + house2?.totalExternal + house2?.totalEvents;
        house3 =
          house3?.totalInternal + house3?.totalExternal + house3?.totalEvents;
        house4 =
          house4?.totalInternal + house4?.totalExternal + house4?.totalEvents;
      } else {
        const currentDate = new Date();
        let currentYear = currentDate?.getFullYear();
        currentYear = currentYear?.toString();

        house1 = houses[0].points[2023][prevMonth];
        house2 = houses[1].points[2023][prevMonth];
        house3 = houses[2].points[2023][prevMonth];
        house4 = houses[3].points[2023][prevMonth];

        house1 = house1?.internal + house1?.external + house1?.events;
        house2 = house2?.internal + house2?.external + house2?.events;
        house3 = house3?.internal + house3?.external + house3?.events;
        house4 = house4?.internal + house4?.external + house4?.events;
      }

      const houseLeaderboard = document?.getElementById("prev");
      hcl = new Chart(houseLeaderboard, {
        type: "bar",
        data: {
          labels: [
            houses[0].name,
            houses[1].name,
            houses[2].name,
            houses[3].name,
          ],
          datasets: [
            {
              label: "Points",
              data: [house1, house2, house3, house4],
              backgroundColor: [
                houses[0].color,
                houses[1].color,
                houses[2].color,
                houses[3].color,
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 0,
              borderRadius: 10
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
              ticks: {
                display: true,
                major: true,
              },
              border: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
            },
          },
        },
      });
    }

    return () => {
      if (hcl) {
        hcl.destroy();
      }
    };
  }, [loading, selectedMonth]);

  useEffect(() => {
    let hcl;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    if (!loading) {
      let house1, house2, house3, house4;

      house1 = calculateTotalPoints(houses[0]);
      house2 = calculateTotalPoints(houses[1]);
      house3 = calculateTotalPoints(houses[2]);
      house4 = calculateTotalPoints(houses[3]);

      house1 =
        house1?.totalInternal + house1?.totalExternal + house1?.totalEvents;
      house2 =
        house2?.totalInternal + house2?.totalExternal + house2?.totalEvents;
      house3 =
        house3?.totalInternal + house3?.totalExternal + house3?.totalEvents;
      house4 =
        house4?.totalInternal + house4?.totalExternal + house4?.totalEvents;

      const houseLeaderboard = document.getElementById("yearly");
      hcl = new Chart(houseLeaderboard, {
        type: "bar",
        data: {
          labels: [
            houses[0].name,
            houses[1].name,
            houses[2].name,
            houses[3].name,
          ],
          datasets: [
            {
              label: "Points",
              data: [house1, house2, house3, house4],
              backgroundColor: [
                houses[0].color,
                houses[1].color,
                houses[2].color,
                houses[3].color,
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 0,
              borderRadius: 10
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
              ticks: {
                display: true,
                major: true,
              },
              border: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "#f2f2f2",
                display: false,
              },
            },
          },
        },
      });
    }

    return () => {
      if (hcl) {
        hcl.destroy();
      }
    };
  }, [loading, currentYear]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      async (res) =>
        await res
          .json()
          .then((data) => {
            setHouses(data.houses);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            toast({
              title: "Error",
              description: "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          })
    );
  }, []);

  if (!loading) {
    return (
      <>
        {role === "S" ? (
          <Navbar />
        ) : role === "A" ? (
          <AdminNavbar />
        ) : role === "F" ? (
          <FacultyNavbar />
        ) : (
          <GuestNavbar />
        )}
        <Box className="houses">
          <Flex className="graph-wrapper" gap="20px" wrap="wrap">
            {houses.map((house) => (
              <Card
                key={house._id}
                className="house-card"
                bg={house.color}
                cursor="pointer"
                onClick={() => {
                  navigate(`/houses/${house._id}`);
                }}
              >
                <CardBody>
                  <Text textAlign="center">{house.name}</Text>
                </CardBody>
              </Card>
            ))}
          </Flex>
          <Box className="graph-wrapper">
            <Flex gap="20px" justifyContent="space-between" wrap="wrap">
              <Box p="20px" width="32%" className="graphs" height="65vh">
                <Text fontSize="25px" mb="50px">
                  Leaderboard - Monthly
                </Text>
                <Box height="80%">
                  <canvas id="monthly" height="200px"></canvas>
                </Box>
              </Box>

              <Box p="20px" width="32%" className="graphs" height="65vh">
                <Text
                  fontSize="25px"
                  mb="50px"
                  alignSelf="flex-end"
                  textAlign="center"
                  width="100%"
                >
                  Leaderboard - Previous Month
                </Text>
                <Box height="80%">
                  {" "}
                  <canvas id="prev"></canvas>
                </Box>
              </Box>

              <Box
                
                p="20px"
                width="32%"
                className="graphs"
                height="65vh"
              >
                <Text
                  fontSize="25px"
                  mb="50px"
                  alignSelf="flex-end"
                  textAlign="end"
                  width="100%"
                >
                  Leaderboard - Yearly
                </Text>
                <Box height="80%">
                  {" "}
                  <canvas id="yearly"></canvas>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Houses;
