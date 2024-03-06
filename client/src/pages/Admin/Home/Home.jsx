import {
  Box,
  Text,
  Select,
  Table,
  Thead,
  Tr,
  Td,
  useToast,
  Tbody,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/admin/Navbar";
import "./Home.css";
import Chart from "chart.js/auto";
import { useAuthCheck } from "../../../hooks/useAuthCheck";
import Loader from "../../../components/Loader";

const Home = () => {
  useAuthCheck("A");
  const toast = useToast();

  const [houses, setHouses] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState(0);

  function calculateTotalPoints(data, year) {
    const currentDate = new Date();
    const currentYear = year || currentDate?.getFullYear(); // Get the current year

    let totalInternalPoints = 0;
    let totalExternalPoints = 0;
    let totalEventsPoints = 0;

    if (data && data?.points && data?.points[currentYear?.toString()]) {
      const monthlyPoints = data?.points[currentYear?.toString()];
      for (const month in monthlyPoints) {
        if (monthlyPoints?.hasOwnProperty(month)) {
          // Separate internal, external, and events points
          const { internal, external, events } = monthlyPoints[month];

          // Add them to their respective totals

          if (internal) {
            totalEventsPoints += internal;
          } else {
            totalEventsPoints += 0;
          }

          if (external) {
            totalEventsPoints += external;
          } else {
            totalEventsPoints += 0;
          }

          if (events) {
            totalEventsPoints += events;
          } else {
            totalEventsPoints += 0;
          }
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
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/dashboard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHouses(data?.houses);
        setCertifications(data?.certifications);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error fetching data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, []);

  useEffect(() => {
    const housePoints = document?.getElementById("housePoints");
    if (!loading) {
      let house1 = calculateTotalPoints(houses[0]);
      house1 =
        (house1?.totalInternal ?? 0) +
        (house1?.totalExternal ?? 0) +
        (house1?.totalEvents ?? 0);

      let house2 = calculateTotalPoints(houses[1]);
      house2 =
        (house2?.totalInternal ?? 0) +
        (house2?.totalExternal ?? 0) +
        (house2?.totalEvents ?? 0);

      let house3 = calculateTotalPoints(houses[2]);
      house3 =
        (house3?.totalInternal ?? 0) +
        (house3?.totalExternal ?? 0) +
        (house3?.totalEvents ?? 0);

      let house4 = calculateTotalPoints(houses[3]);
      house4 =
        (house4?.totalInternal ?? 0) +
        (house4?.totalExternal ?? 0) +
        (house4?.totalEvents ?? 0);

      console.log(house1, house2, house3, house4);

      const housePointChart = new Chart(housePoints, {
        type: "bar",
        data: {
          labels: [
            houses[0]?.name,
            houses[1]?.name,
            houses[2]?.name,
            houses[3]?.name,
          ],
          datasets: [
            {
              label: "Points",
              data: [house1, house2, house3, house4],
              borderWidth: 0,
              barPercentage: 5,
              categoryPercentage: 0.1,
              backgroundColor: [
                houses[0]?.color,
                houses[1]?.color,
                houses[2]?.color,
                houses[3]?.color,
              ],
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              display: true,
              beginAtZero: true,
              grid: {
                display: false, // Hide y-axis gridlines
              },
            },
            y: {
              display: false, // Hide y-axis gridlines
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
        },
      });

      return () => {
        if (housePointChart) {
          housePointChart?.destroy();
        }
      };
    }
  }, [houses]);

  useEffect(() => {
    const cert = document?.getElementById("certifications");
    if (!loading) {
      let fe = 0;
      let se = 0;
      let te = 0;
      let be = 0;
      for (const certification of certifications) {
        const { mid } = certification; // 22204016 /
        const year = `20${mid?.slice(0, 2)}`; // 22
        const dse = parseInt(mid?.slice(2, 3)); // 2

        const currentDate = new Date();
        const currentYear = currentDate?.getFullYear(); // Get the current year

        let ay = currentYear - parseInt(year) + 1;
        if (dse === 2) {
          if (ay !== 4) {
            ay++;
          }
        }
        switch (ay) {
          case 1:
            fe++;
            break;
          case 2:
            se++;
            break;
          case 3:
            te++;
            break;
          case 4:
            be++;
            break;
          default:
            break;
        }
      }

      const certChart = new Chart(cert, {
        type: "bar",
        data: {
          labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
          datasets: [
            {
              label: "Submissions",
              data: [fe, se, te, be],
              backgroundColor: "#AAC9FF",
              borderWidth: 1,
              borderRadius: 5,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              display: false, // Hide x-axis gridlines
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                display: false, // Hide y-axis gridlines
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
        },
      });

      return () => {
        if (certChart) {
          certChart?.destroy();
        }
      };
    }
  }, [certifications]);

  useEffect(() => {
    const currentDate = new Date();
    let currentYear = currentDate?.getFullYear();
    currentYear = currentYear?.toString();

    let selectedHouseChart;

    if (!loading && selectedHouse !== null && houses?.length > 0) {
      const jan =
        houses[selectedHouse]?.points[currentYear?.toString()]?.january
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.january
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.january
            ?.events ??
        0;
      const feb =
        houses[selectedHouse]?.points[currentYear?.toString()]?.february
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.february
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.february
            ?.events ??
        0;
      const mar =
        houses[selectedHouse]?.points[currentYear?.toString()]?.march
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.march
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.march
            ?.events ??
        0;
      const apr =
        houses[selectedHouse]?.points[currentYear?.toString()]?.april
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.april
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.april
            ?.events ??
        0;
      const may =
        houses[selectedHouse]?.points[currentYear?.toString()]?.may?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.may
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.may?.events ??
        0;
      const jun =
        houses[selectedHouse]?.points[currentYear?.toString()]?.june
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.june
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.june
            ?.events ??
        0;
      const jul =
        houses[selectedHouse]?.points[currentYear?.toString()]?.july
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.july
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.july
            ?.events ??
        0;
      const aug =
        houses[selectedHouse]?.points[currentYear?.toString()]?.august
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.august
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.august
            ?.events ??
        0;
      const sep =
        houses[selectedHouse]?.points[currentYear?.toString()]?.september
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.september
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.september
            ?.events ??
        0;
      const oct =
        houses[selectedHouse]?.points[currentYear?.toString()]?.october
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.october
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.october
            ?.events ??
        0;
      const nov =
        houses[selectedHouse]?.points[currentYear?.toString()]?.november
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.november
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.november
            ?.events ??
        0;
      const dec =
        houses[selectedHouse]?.points[currentYear?.toString()]?.december
          ?.internal ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.december
            ?.external ??
        0 +
          houses[selectedHouse]?.points[currentYear?.toString()]?.december
            ?.events ??
        0;

      const houseAssesment = document?.getElementById("houseAssesment");
      selectedHouseChart = new Chart(houseAssesment, {
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
              borderColor: "#3e95cd",
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
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
                display: false, // Set the step size to 1 to show whole numbers
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
      if (selectedHouseChart) {
        selectedHouseChart?.destroy();
      }
    };
  }, [loading, selectedHouse]);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="AdminHome">
          <Box className="left">
            <Box className="top">
              <Box className="housePoints">
                <Text fontSize="md" mb="5px">
                  Points Distribution - House Wise
                </Text>
                <canvas id="housePoints" width="300" height="200"></canvas>
              </Box>
              <Box className="certifications">
                <Text fontSize="md" mb="5px">
                  Certification Submissions
                </Text>
                <canvas id="certifications" width="300" height="200"></canvas>
              </Box>
            </Box>
            <Box className="bottom">
              <Table>
                <Thead>
                  <Tr>
                    <Td>Student Name</Td>
                    <Td>Certificate Name </Td>
                    <Td>Submitted Date</Td>
                    <Td>Approval Status</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {certifications?.slice(0, 3)?.map((certification) => {
                    return (
                      <Tr key={certification?._id}>
                        <Td>{certification?.name}</Td>
                        <Td
                          whiteSpace="nowrap"
                          maxW="50px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {certification?.certificateName}
                        </Td>
                        <Td>{certification?.submittedYear}</Td>
                        <Td>{certification?.status}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Box>
          <Box className="right">
            <Box className="top">
              <Box className="houseAssesment">
                <Flex justify="space-between" align="center" mb="20px">
                  {" "}
                  <Text fontSize="md" mb="5px">
                    House Assessment
                  </Text>
                  <Select
                    width="150px"
                    onChange={(e) => setSelectedHouse(e?.target?.value)}
                    variant="filled"
                    colorScheme="green"
                  >
                    {houses?.map((house, index) => {
                      return (
                        <option key={house?._id} value={index}>
                          {house?.name}
                        </option>
                      );
                    })}
                  </Select>
                </Flex>
                <canvas id="houseAssesment" width="450" height="200"></canvas>
              </Box>
              <Box className="currentEvents">
                <canvas id="currentEvents"></canvas>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Home;
