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
    const currentYear = year || currentDate.getFullYear(); // Get the current year

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
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/dashboard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHouses(data.houses);
        setCertifications(data.certifications);
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
    const housePoints = document.getElementById("housePoints");
    if (!loading) {
      let house1 = calculateTotalPoints(houses[0]);
      house1 = house1.totalInternal + house1.totalExternal + house1.totalEvents;

      let house2 = calculateTotalPoints(houses[1]);
      house2 = house2.totalInternal + house2.totalExternal + house2.totalEvents;

      let house3 = calculateTotalPoints(houses[2]);
      house3 = house3.totalInternal + house3.totalExternal + house3.totalEvents;

      let house4 = calculateTotalPoints(houses[3]);
      house4 = house4.totalInternal + house4.totalExternal + house4.totalEvents;

      const housePointChart = new Chart(housePoints, {
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
              borderWidth: 0,
              barPercentage: 5,
              categoryPercentage: 0.1,
              backgroundColor: [
                houses[0].color,
                houses[1].color,
                houses[2].color,
                houses[3].color,
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
          housePointChart.destroy();
        }
      };
    }
  }, [houses]);

  useEffect(() => {
    const cert = document.getElementById("certifications");
    if (!loading) {
      let fe = 0;
      let se = 0;
      let te = 0;
      let be = 0;
      for (const certification of certifications) {
        const { mid } = certification; // 22204016 /
        const year = `20${mid.slice(0, 2)}`; // 22
        const dse = parseInt(mid.slice(2, 3)); // 2

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear(); // Get the current year

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
          certChart.destroy();
        }
      };
    }
  }, [certifications]);

  useEffect(() => {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    let selectedHouseChart;

    if (!loading) {
      const jan =
        houses[selectedHouse].points[currentYear.toString()]["january"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["january"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["january"].events;
      const feb =
        houses[selectedHouse].points[currentYear.toString()]["february"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["february"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["february"].events;
      const mar =
        houses[selectedHouse].points[currentYear.toString()]["march"].internal +
        houses[selectedHouse].points[currentYear.toString()]["march"].external +
        houses[selectedHouse].points[currentYear.toString()]["march"].events;
      const apr =
        houses[selectedHouse].points[currentYear.toString()]["april"].internal +
        houses[selectedHouse].points[currentYear.toString()]["april"].external +
        houses[selectedHouse].points[currentYear.toString()]["april"].events;
      const may =
        houses[selectedHouse].points[currentYear.toString()]["may"].internal +
        houses[selectedHouse].points[currentYear.toString()]["may"].external +
        houses[selectedHouse].points[currentYear.toString()]["may"].events;
      const jun =
        houses[selectedHouse].points[currentYear.toString()]["june"].internal +
        houses[selectedHouse].points[currentYear.toString()]["june"].external +
        houses[selectedHouse].points[currentYear.toString()]["june"].events;
      const jul =
        houses[selectedHouse].points[currentYear.toString()]["july"].internal +
        houses[selectedHouse].points[currentYear.toString()]["july"].external +
        houses[selectedHouse].points[currentYear.toString()]["july"].events;
      const aug =
        houses[selectedHouse].points[currentYear.toString()]["august"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["august"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["august"].events;
      const sep =
        houses[selectedHouse].points[currentYear.toString()]["september"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["september"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["september"]
          .events;
      const oct =
        houses[selectedHouse].points[currentYear.toString()]["october"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["october"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["october"].events;
      const nov =
        houses[selectedHouse].points[currentYear.toString()]["november"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["november"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["november"].events;
      const dec =
        houses[selectedHouse].points[currentYear.toString()]["december"]
          .internal +
        houses[selectedHouse].points[currentYear.toString()]["december"]
          .external +
        houses[selectedHouse].points[currentYear.toString()]["december"].events;

      const houseAssesment = document.getElementById("houseAssesment");
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
        selectedHouseChart.destroy();
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
                  {certifications.slice(0, 3).map((certification) => {
                    return (
                      <Tr key={certification._id}>
                        <Td>{certification.name}</Td>
                        <Td whiteSpace="nowrap" maxW="50px" overflow="hidden" textOverflow="ellipsis">{certification.certificateName}</Td>
                        <Td>{certification.submittedYear}</Td>
                        <Td>{certification.status}</Td>
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
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    variant="filled"
                    colorScheme="green"
                  >
                    {houses.map((house, index) => {
                      return (
                        <option key={house._id} value={index}>
                          {house.name}
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
    return <Loader/>
  }
};

export default Home;
