import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
////////////////////////////////
import {
  getDeviceData,
  rebootGateway,
  loginUser,
  resetPassword,
} from "../modules/services";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  Form,
  Stack,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
//////////////////////
import { AuthContext } from "../context/AuthContext";
import DeviceCardGroup from "../components/deviceCardGroup";

const System = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceData, setDeviceData] = useState();
  const [showDevices, setShowDevices] = useState(false);
  const [wifi2Clients, setWifi2Clients] = useState(0);
  const [wifi5Clients, setWifi5Clients] = useState(0);
  const [ethernetClients, setEthernetClients] = useState(0);
  const [currentPassword, setCurrentPassword] = useState(user?.password);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getData();
      const interval = setInterval(() => {
        getData();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      navigate("/login", { replace: true });
    }
  }, [user]);

  const getData = () => {
    getDeviceData(user.token)
      .then((clientData) => {
        setEthernetClients(clientData.data.clients.ethernet.length);
        setWifi2Clients(clientData.data.clients["2.4ghz"].length);
        setWifi5Clients(clientData.data.clients["5.0ghz"].length);
        setDeviceData(clientData);
      })
      .catch((error) => {
        console.log(error.toJSON());
        loginUser({ username: "admin", password: user.password })
          .then((loginData) => {
            let tempPassword = user.password;
            setUser({
              token: loginData.data.auth.token,
              password: tempPassword,
            });
          })
          .catch((response) => {
            console.log(response);
          });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPassword === user?.password) {
      setIsLoading(true);
      resetPassword(user.token, {
        passwordNew: newPassword,
        usernameNew: "admin",
      })
        .then((response) => {
          console.log(response.toJSON());
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error.toJSON());
          setIsLoading(false);
          navigate("/login", { replace: true });
        });
    } else {
      alert("Wrong password");
    }
  };
  ////////////////
  const handleCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleShowPassword = (e) => {
    setShowPassword(!showPassword);
  };
  const handleShowNewPassword = (e) => {
    setShowNewPassword(!showNewPassword);
  };
  const deviceDisplay = () => {
    setShowDevices(!showDevices);
  };

  const restart = () => {
    setIsLoading(true);
    rebootGateway(user.token)
      .then((response) => {
        console.log(response.toJSON());
      })
      .catch((error) => {
        console.log(error.toJSON());
        if (error.message === "timeout of 4000ms exceeded") {
          setIsLoading(false);
          navigate("/login", { replace: true });
        }
      });
  };

  return (
    <div>
      <Container>
        <CardGroup>
          <Card bg="dark" text="light" className="m-2 rounded shadow">
            <Card.Body>
              <Card.Title>Settings</Card.Title>
              <Container>
                <Form onSubmit={handleSubmit}>
                  <Row className="w-75 mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                      <Form.Control
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        maxLength="40"
                        value={currentPassword}
                        onChange={handleCurrentPassword}
                        isInvalid={user?.password !== currentPassword}
                      />

                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        onClick={handleShowPassword}
                      />
                    </Stack>
                  </Row>
                  <Row className="w-75">
                    <Form.Label>New Password</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                      <Form.Control
                        required
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        maxLength="40"
                        value={newPassword}
                        onChange={handleNewPassword}
                        isInvalid={newPassword.length < 8}
                      />

                      <FontAwesomeIcon
                        icon={showNewPassword ? faEye : faEyeSlash}
                        onClick={handleShowNewPassword}
                      />
                    </Stack>
                  </Row>
                  {isLoading ? (
                    <Row className="mt-3">
                      <Spinner animation="border" />
                    </Row>
                  ) : (
                    <Stack direction="horizontal" gap={3}>
                      <Button
                        variant="success"
                        className="me-3 mt-3"
                        type="submit"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="warning"
                        className="mt-3"
                        onClick={restart}
                      >
                        Reboot Gateway
                      </Button>
                    </Stack>
                  )}
                </Form>
              </Container>
            </Card.Body>
          </Card>

          <Card bg="dark" text="light" className="m-2 rounded shadow">
            <Card.Body>
              <Card.Title>Network Devices</Card.Title>
              <Container>
                <Row className="w-75 mb-2">
                  <Col>
                    <b>2.4GHz</b>
                  </Col>
                  <Col>{wifi2Clients}</Col>
                </Row>
                <Row className="w-75 mb-2">
                  <Col>
                    <b>5GHz</b>
                  </Col>
                  <Col>{wifi5Clients}</Col>
                </Row>
                <Row className="w-75 mb-2">
                  <Col>
                    <b>Ethernet</b>
                  </Col>
                  <Col>{ethernetClients}</Col>
                </Row>
                <Row>
                  {showDevices ? (
                    <Button
                      variant="danger"
                      className="m-2"
                      onClick={deviceDisplay}
                    >
                      Hide Devices
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      className="m-2"
                      onClick={deviceDisplay}
                    >
                      Show Devices
                    </Button>
                  )}
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </CardGroup>
        {showDevices ? (
          Object.keys(deviceData.data.clients).map((key, index) => {
            return (
              <DeviceCardGroup
                key={index}
                props={key}
                data={deviceData.data.clients[key]}
              />
            );
          })
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export default System;
