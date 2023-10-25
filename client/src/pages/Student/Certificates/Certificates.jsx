import React, { useEffect } from "react";
import Navbar from "../../../components/student/Navbar/";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  ModalCloseButton,
  useToast,
  Text,
  Input,
  FormLabel,
  Alert,
  FormControl,
  Select,
} from "@chakra-ui/react";
import Breadcrumb from "../../../components/Breadcrumb";
import "./Certificates.css";
import Loader from "../../../components/Loader";
import { Link } from "react-router-dom";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Certificates = () => {
  useAuthCheck("S");
  const [certificates, setCertificates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [certificateName, setCertificateName] = React.useState("");
  const [issuingOrg, setIssuingOrg] = React.useState("");
  const [issueMonth, setIssueMonth] = React.useState("");
  const [issueYear, setIssueYear] = React.useState("");
  const [certificateType, setCertificateType] = React.useState("");
  const [certificateLevel, setCertificateLevel] = React.useState("");
  const [certificateUrl, setCertificateUrl] = React.useState("");
  const [file, setFile] = React.useState("");
  const [fileName, setFileName] = React.useState("No File Selected");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        setLoading(false);
        if (res.status === 200) {
          const data = await res.json();
          setCertificates(data);
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
  }, []);

  const year = new Date().getFullYear();
  const prevYear = year - 1;
  const prevPrevYear = year - 2;
  const prevPrevPrevYear = year - 3;

  const handleUpload = () => {
    const uploadedCertificate = document.querySelector("#upload").files[0];

    const formData = new FormData();

    if (
      certificateName === "" ||
      issuingOrg === "" ||
      issueMonth === "" ||
      issueYear === "" ||
      certificateType === "" ||
      certificateLevel === ""
    ) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (uploadedCertificate || certificateUrl) {
      if (
        certificateName &&
        issuingOrg &&
        issueMonth &&
        issueYear &&
        certificateType &&
        certificateLevel
      ) {
        formData.append("certificateName", certificateName);
        formData.append("issuingOrg", issuingOrg);
        formData.append("issueMonth", issueMonth);
        formData.append("issueYear", issueYear);
        formData.append("certificateType", certificateType);
        formData.append("certificateLevel", certificateLevel);
        formData.append("certificateURL", certificateUrl);
        formData.append("certificate", file);

        fetch(
          `${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/upload`,
          {
            method: "POST",
            credentials: "include",
            body: formData, // Use the FormData object as the body
          }
        )
          .then(async (res) => {
            if (res.status === 200) {
              window.location.reload();
              onClose();
            } else if (uploadedCertificate && certificateUrl) {
              toast({
                title: "Error",
                description: "Please fill either URL or upload certificate",
                status: "error",
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
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill either URL or upload certificate",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFile = (file) => {
    setFileName(file.name);
    setFile(file);
  };

  if (!loading) {
    return (
      <>
        <Navbar />
        <Breadcrumb title="Certificates" links={[{ href: "/", name: "" }]} />
        <Box className="StudentCertificates">
          <Button colorScheme="green" marginBottom="20px" onClick={onOpen}>
            Upload Certificate
          </Button>
          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Sr No.</Th>
                  <Th>Certification Name</Th>
                  <Th>Issuing Organization</Th>
                  <Th>Issue Date</Th>
                  <Th>Certification Type</Th>
                  <Th>Level</Th>
                  <Th>Status</Th>
                  <Th>View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {certificates.map((certificate, index) => (
                  /* ! CHANGE TARGET*/
                  <Tr key={certificate?._id}>
                    <Td>{index + 1}</Td>
                    <Td>{certificate?.certificateName}</Td>
                    <Td>{certificate?.issuingOrg}</Td>
                    <Td>
                      {certificate?.issueMonth?.charAt(0).toUpperCase() +
                        certificate?.issueMonth?.slice(1)}{" "}
                      {certificate?.issueYear}
                    </Td>
                    <Td>
                      {certificate?.certificateType?.charAt(0).toUpperCase() +
                        certificate?.certificateType?.slice(1)}
                    </Td>
                    <Td>
                      {certificate?.certificateLevel?.charAt(0).toUpperCase() +
                        certificate?.certificateLevel?.slice(1)}
                    </Td>
                    <Td>
                      {certificate.status?.charAt(0).toUpperCase() +
                        certificate.status?.slice(1)}
                    </Td>
                    <Td>
                      <Link to={`/certificates/${certificate?._id}`}>View</Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
            <ModalContent>
              <ModalHeader>Upload Certificate</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box className="upload-main-StudentCertificates">
                  <Alert status="info" marginBottom="20px">
                    Your Certificate will be verified and approved by the house
                    coordinator.
                  </Alert>

                  <FormControl>
                    <FormLabel>Certificate Name</FormLabel>
                    <Input
                      type="text"
                      placeholder=""
                      onChange={(e) => {
                        setCertificateName(e?.target?.value);
                      }}
                      value={certificateName}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Issuing Organization</FormLabel>
                    <Input
                      type="text"
                      placeholder=""
                      onChange={(e) => {
                        setIssuingOrg(e?.target?.value);
                      }}
                      value={issuingOrg}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Certification Date</FormLabel>
                    <Box className="flex">
                      <Select
                        placeholder="Select Month"
                        onChange={(e) => setIssueMonth(e?.target?.value)}
                        value={issueMonth}
                      >
                        <option value="jan">January</option>
                        <option value="feb">February</option>
                        <option value="mar">March</option>
                        <option value="apr">April</option>
                        <option value="may">May</option>
                        <option value="jun">June</option>
                        <option value="jul">July</option>
                        <option value="aug">August</option>
                        <option value="sep">September</option>
                        <option value="oct">October</option>
                        <option value="nov">November</option>
                        <option value="dec">December</option>
                      </Select>

                      <Select
                        placeholder="Select Year"
                        onChange={(e) => setIssueYear(e?.target?.value)}
                        value={issueYear}
                      >
                        <option value={prevPrevPrevYear}>
                          {prevPrevPrevYear}
                        </option>
                        <option value={prevPrevYear}>{prevPrevYear}</option>
                        <option value={prevYear}>{prevYear}</option>
                        <option value={year}>{year}</option>
                      </Select>
                    </Box>
                  </FormControl>

                  <Box className="flex">
                    <Select
                      placeholder="Select Type"
                      onChange={(e) => setCertificateType(e?.target?.value)}
                      value={certificateType}
                    >
                      <option value="internal">Internal Certification</option>
                      <option value="external">External Certification</option>
                    </Select>

                    <Select
                      placeholder="Select Level"
                      onChange={(e) => setCertificateLevel(e?.target?.value)}
                      value={certificateLevel}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </Box>

                  <Box className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Certification URL"
                        onChange={(e) => setCertificateUrl(e?.target?.value)}
                        value={certificateUrl}
                      />
                    </FormControl>
                    <Text>OR</Text>
                    <FormControl>
                      <Box className="flex">
                        <label htmlFor="upload" className="upload-btn">
                          Upload Certificate
                        </label>
                        <p>{fileName}</p>
                      </Box>
                      <Input
                        type="file"
                        name="upload"
                        placeholder="Upload Certificate"
                        id="upload"
                        accept=".pdf , .jpg , .jpeg , .png, .webp"
                        onChange={(e) => {
                          handleFile(e?.target?.files[0]);
                        }}
                      />
                    </FormControl>
                  </Box>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost" onClick={handleUpload}>
                  Submit for Approval
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Certificates;
