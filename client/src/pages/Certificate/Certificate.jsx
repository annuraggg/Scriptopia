import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Alert,
  Flex,
  Link,
  Code,
} from "@chakra-ui/react";
import "./Certificate.css";
import Navbar from "../../components/student/Navbar";
import Loader from "../../components/Loader";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import AdminNavbar from "../../components/admin/Navbar";
import FacultyNavbar from "../../components/faculty/Navbar";
import GuestNavbar from "../../components/guest/Navbar";
import { useNavigate } from "react-router-dom";
import { CopyIcon } from "@chakra-ui/icons";

const Certificate = () => {
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [certificateName, setCertificateName] = useState();
  const [issuingOrg, setIssuingOrg] = useState();
  const [issueMonth, setIssueMonth] = useState();
  const [issueYear, setIssueYear] = useState();
  const [certificateType, setCertificateType] = useState();
  const [certificateLevel, setCertificateLevel] = useState();

  const navigate = useNavigate();

  const [editPrivilege, setEditPrivilege] = useState(false);
  const [role, setRole] = useState("");
  const [mid, setMid] = useState("");

  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);

  const [colorStatus, setColorStatus] = useState("blue");

  const [steps, setSteps] = useState([
    { title: "Step I: Upload", description: "Uploaded" },
    { title: "Step II: Review", description: "Pending" },
    { title: "Step III: Approval By Faculty", description: "Pending" },
  ]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const {
    isOpen: isHashOpen,
    onOpen: onHashOpen,
    onClose: onHashClose,
  } = useDisclosure();

  const year = new Date().getFullYear();
  const prevYear = year - 1;
  const prevPrevYear = year - 2;
  const prevPrevPrevYear = year - 3;

  useEffect(() => {
    let jwt;
    const token = Cookies.get("token");
    if (token) {
      jwt = jwtDecode(token);
      if (jwt?.role) {
        setRole(jwt.role);
        if (jwt.role === "S" || jwt.role === "F") {
          setMid(jwt.mid);
        }
      } else {
        setRole("G");
      }
    }
  }, []);

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/certificates/get`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCertificate(data);
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
      });
  }, []);

  useEffect(() => {
    if (certificate?.mid === mid) {
      setEditPrivilege(true);
    }
  }, [certificate]);

  const toast = useToast();

  useEffect(() => {
    setCertificateName(certificate?.certificateName);
    setIssuingOrg(certificate?.issuingOrg);
    setIssueMonth(certificate?.issueMonth);
    setIssueYear(certificate?.issueYear);
    setCertificateType(certificate?.certificateType);
    setCertificateLevel(certificate?.certificateLevel);
  }, [certificate]);

  const handleDownload = () => {
    setLoader3(true);
    if (certificate?.uploadType === "url") {
      setLoader3(false);
      window.open(certificate?.certificateURL, "_blank");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/certificates/download`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: certificate._id,
      }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        // Assuming 'blob' contains the raw PDF data

        // Create a Blob from the raw PDF data
        let pdfBlob;
        if (certificate?.ext === "pdf") {
          pdfBlob = new Blob([blob], { type: "application/pdf" });
        } else {
          pdfBlob = new Blob([blob]);
        }

        // Generate a URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create an anchor element to download the PDF
        const link = document.createElement("a");
        link.href = pdfUrl;
        if (certificate?.ext === "pdf") {
          link.setAttribute(
            "inline",
            `${certificate?.certificateName}.${certificate?.ext}`
          );
        } else {
          link.setAttribute(
            "download",
            `${certificate?.certificateName}.${certificate?.ext}`
          );
        }

        // Trigger a click event to initiate the download
        link.click();

        // Clean up by removing the anchor element and revoking the URL
        link.remove();
        URL.revokeObjectURL(pdfUrl);

        setLoader3(false);
      })
      .catch((err) => {
        setLoader3(false);
        console.error(err);
        /* toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });*/
      });
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  useEffect(() => {
    const updatedSteps = [...steps];

    if (certificate.status === "rejected") {
      updatedSteps[2].description = "Rejected";
      updatedSteps[1].description = "Reviewed";
      setActiveStep(2);
      setColorStatus("red");
    }

    if (certificate.status === "approved") {
      updatedSteps[2].description = "Approved";
      updatedSteps[1].description = "Reviewed";
      setActiveStep(3);
      setColorStatus("green");
    }

    if (certificate.status === "pending") {
      updatedSteps[2].description = "Pending";
      setActiveStep(0);
      setColorStatus("blue");
    }

    setSteps(updatedSteps);
  }, [certificate]);

  const handleUpdate = () => {
    setLoader2(true);
    let url;
    if (certificate?.role === "F") {
      url = `${
        import.meta.env.VITE_BACKEND_ADDRESS
      }/faculty/certifications/update`;
    } else {
      url = `${
        import.meta.env.VITE_BACKEND_ADDRESS
      }/student/certificates/update`;
    }

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        certificateName,
        issuingOrg,
        issueMonth,
        issueYear,
        certificateType,
        certificateLevel,
        id: certificate._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoader2(false);
        onEditClose();
        window.location.reload();
      })
      .catch((err) => {
        setLoader2(false);
        console.error(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    setLoader1(true);
    let url;
    if (certificate?.role === "F") {
      url = `${
        import.meta.env.VITE_BACKEND_ADDRESS
      }/faculty/certifications/delete`;
    } else {
      url = `${
        import.meta.env.VITE_BACKEND_ADDRESS
      }/student/certificates/delete`;
    }

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: certificate._id,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setLoader1(false);
        toast({
          title: "Success",
          description: "Certificate Deleted Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        if (certificate.role === "F") {
          navigate("/faculty/certifications");
        } else {
          navigate("/certificates");
        }
      })
      .catch((err) => {
        setLoader1(false);
        console.error(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to Clipboard",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const calculateExpiry = () => {
    const monthNames = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (certificate?.expires) {
      if (certificate?.expiryYear < currentYear) return false;
      if (certificate?.expiryYear > currentYear) return true;

      if (monthNames.indexOf(certificate?.expiryMonth) < currentMonth)
        return false;
      if (monthNames.indexOf(certificate?.expiryMonth) > currentMonth)
        return true;
      if (monthNames.indexOf(certificate?.expiryMonth) === currentMonth)
        return true;
    }

    return true;
  };

  if (!loading) {
    if (certificate.role === "F") {
      return (
        <>
          {console.log(certificate.role)}
          {role === "S" ? (
            <Navbar />
          ) : role === "A" ? (
            <AdminNavbar />
          ) : role === "F" ? (
            <FacultyNavbar />
          ) : (
            <GuestNavbar />
          )}
          <Box className="StudentCertificate">
            <Box
              className="info"
              display="flex"
              flexDir="column"
              gap="15px"
              alignItems="center"
              justifyContent="center"
              height="50vh"
            >
              <Text textAlign="center">
                {certificate?.certificateType?.charAt(0).toUpperCase() +
                  certificate?.certificateType?.slice(1)}{" "}
                Certification -{" "}
                {certificate?.certificateLevel?.charAt(0).toUpperCase() +
                  certificate?.certificateLevel?.slice(1)}{" "}
                Level
              </Text>
              <Text textAlign="center" mt="-17px">
                Uploaded By {certificate.name}
              </Text>
              {certificate?.expires === "true" ? (
                !calculateExpiry() ? (
                  <Text color="red" textAlign="center" mt="-17px">
                    Certificate Expired On{" "}
                    {certificate?.expiryMonth.slice(0, 1).toUpperCase() +
                      certificate?.expiryMonth.slice(1)}{" "}
                    {certificate?.expiryYear}
                  </Text>
                ) : (
                  <Text color="green" textAlign="center" mt="-17px">
                    Certificate Expires On{" "}
                    {certificate?.expiryMonth.slice(0, 1).toUpperCase() +
                      certificate?.expiryMonth.slice(1)}{" "}
                    {certificate?.expiryYear}
                  </Text>
                )
              ) : null}
              <Heading textAlign="center">
                {certificate?.certificateName?.charAt(0).toUpperCase() +
                  certificate?.certificateName?.slice(1)}{" "}
              </Heading>
              <Text textAlign="center">
                By{" "}
                {certificate?.issuingOrg?.charAt(0).toUpperCase() +
                  certificate?.issuingOrg?.slice(1)}
              </Text>

              {certificate.uploadType !== "print" ? (
                <Button
                  colorScheme="green"
                  onClick={() => window.print()}
                  isLoading={loader3}
                  width="fit-content"
                  alignSelf="center"
                >
                  Print
                </Button>
              ) : null}
              {certificate.uploadType === "file" ? (
                <Link textAlign="center" color="blue.600" onClick={onHashOpen}>
                  Verify Hashes
                </Link>
              ) : null}
              <Text textAlign="center">
                Issued On{" "}
                {certificate?.issueMonth?.charAt(0).toUpperCase() +
                  certificate?.issueMonth?.slice(1)}{" "}
                {certificate?.issueYear}
              </Text>
            </Box>

            <Box className="comments" mb="20px" mt="20px">
              <Textarea
                readOnly
                resize="none"
                value={
                  certificate?.comments
                    ? certificate?.comments
                    : "No Comments Yet"
                }
              />
            </Box>

            <Box className="buttons">
              {certificate?.status !== "approved" && editPrivilege ? (
                <Button colorScheme="blue" onClick={onEditOpen}>
                  Edit Certificate
                </Button>
              ) : editPrivilege ? null : null}{" "}
              {editPrivilege ? (
                <Button colorScheme="red" onClick={onOpen}>
                  Delete Certificate
                </Button>
              ) : null}
            </Box>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Certificate?
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You will lose all the XP associated with this
                    certificate.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDelete}
                      ml={3}
                      isLoading={loader1}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl">
              <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
              <ModalContent>
                <ModalHeader>Edit Certificate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box className="upload-main-StudentCertificates">
                    <Alert status="info" marginBottom="20px">
                      Your Certificate will be verified and approved by the
                      house coordinator.
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
                  </Box>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onEditClose}>
                    Close
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleUpdate}
                    isLoading={loader2}
                  >
                    Submit for Re-Approval
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>

          <Modal isOpen={isHashOpen} onClose={onHashClose} size="2xl">
            <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
            <ModalContent>
              <ModalHeader>Verify Hashes</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>SHA256 Hash:</Text>
                <Code>{certificate?.sha256}</Code>
                <CopyIcon
                  ml="10px"
                  cursor="pointer"
                  onClick={() => copyText(certificate?.sha256)}
                />
                <Text>MD5 Hash: </Text>
                <Code>{certificate?.md5}</Code>
                <CopyIcon
                  ml="10px"
                  cursor="pointer"
                  onClick={() => copyText(certificate?.md5)}
                />

                <Text mt="20px">
                  <b>1.</b> Go to the directory containing the file
                </Text>
                <Text>
                  <b>2.</b> Open a Terminal in that Directory
                </Text>
                <Text>
                  <b>3.</b> Type the following command
                </Text>

                <Box ml="20px">
                  {" "}
                  <Text mt="10px">On Windows</Text>
                  <Code>
                    certUtil -hashfile '
                    {certificate?.certificateName +
                      "." +
                      certificate?.ext +
                      "' MD5"}
                  </Code>
                  <CopyIcon
                    ml="10px"
                    cursor="pointer"
                    onClick={() =>
                      copyText(
                        `certUtil -hashfile '${
                          certificate?.certificateName +
                          "." +
                          certificate?.ext +
                          "' MD5"
                        }`
                      )
                    }
                  />
                  <Text mt="10px">On Linux</Text>
                  <Code>
                    sha256sum '
                    {certificate?.certificateName + "." + certificate?.ext}'
                  </Code>
                  <CopyIcon
                    ml="10px"
                    cursor="pointer"
                    onClick={() =>
                      copyText(
                        `sha256sum '${
                          certificate?.certificateName + "." + certificate?.ext
                        }'`
                      )
                    }
                  />
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onHashClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    } else {
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
          <Box className="StudentCertificate">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignContent="center"
              height="80vh"
            >
              <Box className="info" display="flex" flexDir="column" gap="15px">
                <Text textAlign="center">
                  {certificate?.certificateType?.charAt(0).toUpperCase() +
                    certificate?.certificateType?.slice(1)}{" "}
                  Certification -{" "}
                  {certificate?.certificateLevel?.charAt(0).toUpperCase() +
                    certificate?.certificateLevel?.slice(1)}{" "}
                  Level
                </Text>
                <Text textAlign="center" mt="-17px">
                  Uploaded By {certificate.name}
                </Text>
                {certificate?.expires === "true" ? (
                  !calculateExpiry() ? (
                    <Text color="red" textAlign="center" mt="-17px">
                      Certificate Expired On{" "}
                      {certificate?.expiryMonth.slice(0, 1).toUpperCase() +
                        certificate?.expiryMonth.slice(1)}{" "}
                      {certificate?.expiryYear}
                    </Text>
                  ) : (
                    <Text color="green" textAlign="center" mt="-17px">
                      Certificate Expires On{" "}
                      {certificate?.expiryMonth.slice(0, 1).toUpperCase() +
                        certificate?.expiryMonth.slice(1)}{" "}
                      {certificate?.expiryYear}
                    </Text>
                  )
                ) : null}
                <Heading textAlign="center">
                  {certificate?.certificateName?.charAt(0).toUpperCase() +
                    certificate?.certificateName?.slice(1)}{" "}
                </Heading>
                <Text textAlign="center">
                  By{" "}
                  {certificate?.issuingOrg?.charAt(0).toUpperCase() +
                    certificate?.issuingOrg?.slice(1)}
                </Text>
                {certificate.uploadType !== "print" ? (
                  <Button
                    colorScheme="green"
                    onClick={handleDownload}
                    isLoading={loader3}
                    width="fit-content"
                    alignSelf="center"
                  >
                    Download / View Certificate
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    onClick={() => window.print()}
                    isLoading={loader3}
                    width="fit-content"
                    alignSelf="center"
                  >
                    Print Certificate
                  </Button>
                )}
                {certificate.uploadType === "file" ? (
                  <Link
                    textAlign="center"
                    color="blue.600"
                    onClick={onHashOpen}
                  >
                    Verify Hashes
                  </Link>
                ) : null}

                <Text textAlign="center">
                  Issued On{" "}
                  {certificate?.issueMonth?.charAt(0).toUpperCase() +
                    certificate?.issueMonth?.slice(1)}{" "}
                  {certificate?.issueYear}
                </Text>
              </Box>

              <Box className="track-wrapper">
                <Flex align="center" justify="center" mt="20px">
                  <Stepper
                    index={activeStep}
                    width="50vw"
                    alignSelf="center"
                    colorScheme={colorStatus}
                    mb="20px"
                  >
                    {steps?.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step?.title}</StepTitle>
                          <StepDescription>{step?.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                </Flex>
              </Box>

              <Box className="comments" mb="20px">
                <Textarea
                  readOnly
                  resize="none"
                  value={
                    certificate?.comments
                      ? certificate?.comments
                      : "No Comments Yet"
                  }
                />
              </Box>

              <Box className="buttons">
                {certificate?.status !== "approved" && editPrivilege ? (
                  <Button colorScheme="blue" onClick={onEditOpen}>
                    Edit Certificate
                  </Button>
                ) : editPrivilege ? (
                  <>
                    <Text color="green" fontWeight="500">
                      Your House Earned{" "}
                      {certificate?.xp ? certificate?.xp + " XP" : "0 XP"} from
                      this Certificate
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="green" fontWeight="500">
                      {certificate.name} Earned{" "}
                      {certificate?.xp ? certificate?.xp + " XP" : "0 XP"} from
                      this Certificate
                    </Text>
                  </>
                )}{" "}
                {editPrivilege && certificate?.status !== "approved" ? (
                  <Button colorScheme="red" onClick={onOpen}>
                    Delete Certificate
                  </Button>
                ) : null}
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
                    Delete Certificate?
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You will lose all the XP associated with this
                    certificate.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDelete}
                      ml={3}
                      isLoading={loader1}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl">
              <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
              <ModalContent>
                <ModalHeader>Edit Certificate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box className="upload-main-StudentCertificates">
                    <Alert status="info" marginBottom="20px">
                      Your Certificate will be verified and approved by the
                      house coordinator.
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
                  </Box>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onEditClose}>
                    Close
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleUpdate}
                    isLoading={loader2}
                  >
                    Submit for Re-Approval
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>

          <Modal isOpen={isHashOpen} onClose={onHashClose} size="2xl">
            <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
            <ModalContent>
              <ModalHeader>Verify Hashes</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>SHA256 Hash:</Text>
                <Code>{certificate?.sha256}</Code>
                <CopyIcon
                  ml="10px"
                  cursor="pointer"
                  onClick={() => copyText(certificate?.sha256)}
                />
                <Text>MD5 Hash: </Text>
                <Code>{certificate?.md5}</Code>
                <CopyIcon
                  ml="10px"
                  cursor="pointer"
                  onClick={() => copyText(certificate?.md5)}
                />

                <Text mt="20px">
                  <b>1.</b> Go to the directory containing the file
                </Text>
                <Text>
                  <b>2.</b> Open a Terminal in that Directory
                </Text>
                <Text>
                  <b>3.</b> Type the following command
                </Text>

                <Box ml="20px">
                  {" "}
                  <Text mt="10px">On Windows</Text>
                  <Code>
                    certUtil -hashfile '
                    {certificate?.certificateName +
                      "." +
                      certificate?.ext +
                      "' MD5"}
                  </Code>
                  <CopyIcon
                    ml="10px"
                    cursor="pointer"
                    onClick={() =>
                      copyText(
                        `certUtil -hashfile '${
                          certificate?.certificateName +
                          "." +
                          certificate?.ext +
                          "' MD5"
                        }`
                      )
                    }
                  />
                  <Text mt="10px">On Linux</Text>
                  <Code>
                    sha256sum '
                    {certificate?.certificateName + "." + certificate?.ext}'
                  </Code>
                  <CopyIcon
                    ml="10px"
                    cursor="pointer"
                    onClick={() =>
                      copyText(
                        `sha256sum '${
                          certificate?.certificateName + "." + certificate?.ext
                        }'`
                      )
                    }
                  />
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onHashClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    }
  } else {
    return <Loader />;
  }
};

export default Certificate;
