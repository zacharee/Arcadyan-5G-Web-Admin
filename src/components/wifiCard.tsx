import React, {useState, useContext, useMemo} from "react";
import {
  Card,
  Container,
  Col,
  Row,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import {WifiSettings} from "./wifiSettings";
import { setWifiData } from "../modules/services";
import {WifiConfig} from "../data/WifiConfig";

interface Props {
  cardIndex: number;
  wifiConfig: WifiConfig;
  isLoading: boolean;
  setIsLoading: (boolean) => void;
}

export const WifiCard = ({
  cardIndex,
  wifiConfig,
  isLoading,
  setIsLoading,
}: Props) => {
  //////////////////////////
  ///////// WIFI CONFIG STATE
  //////////////////////////
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ssidArray = wifiConfig.ssids;
  const newSSIDConfig = ssidArray.filter((ssid, index) => index !== cardIndex);
  const data = useMemo(() => wifiConfig?.ssids?.at(cardIndex), [cardIndex, wifiConfig?.ssids]);
  
  const disableDelete = useMemo(() => cardIndex === 0, [cardIndex]);

  const newWifiConfig = {
    ...wifiConfig,
    ssids: newSSIDConfig,
  };

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleting = () => {
    setIsDeleting(!isDeleting);

    setIsEditing(false);

    setShowDelete(!showDelete);
  };

  const handleShowPassword = (e) => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    setShowDelete(!showDelete);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setWifiData(user.token, newWifiConfig)
      .then((responseData) => {
        setIsLoading(false);
        console.log(responseData);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.toJSON());
      });
  };

  //////////////////////////
  ///////// WIFI CONFIGS/OPTIONS
  //////////////////////////

  return (
    <Card bg="dark" text="light" className="m-2 rounded shadow">
      <Card.Body>
        <Card.Title>Network {Number(cardIndex) + 1}</Card.Title>
        <Container>
          <Row>
            <Col>
              <b>SSID</b>
            </Col>
            <Col>{data.ssidName}</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <b>2.4GHz Radio</b>
            </Col>
            <Col>{data["2.4ghzSsid"] ? "enabled" : "disabled"}</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <b>5 GHz Radio</b>
            </Col>
            <Col>{data["5.0ghzSsid"] ? "enabled" : "disabled"}</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <b>Key</b>
            </Col>
            <Col>{!showPassword ? "**********" : data.wpaKey}</Col>
            <Col>
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={handleShowPassword}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <b>Encryption</b>
            </Col>
            <Col>{data.encryptionVersion + " with " + data.encryptionMode}</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <b>Hidden</b>
            </Col>
            <Col>{data.isBroadcastEnabled ? "false" : "true"}</Col>
            <Col></Col>
          </Row>
          {!showDelete && (
            <>
              <Button
                variant="warning"
                className="mb-1 mt-3 me-2"
                onClick={handleEditing}
              >
                Edit
              </Button>
              {!disableDelete ? (
                <Button
                  variant="danger"
                  className="mb-1 mt-3"
                  onClick={handleDeleting}
                  disabled={disableDelete}
                >
                  Delete
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </Container>
      </Card.Body>
      {isEditing && (
        <WifiSettings
          wifiData={data}
          cardIndex={cardIndex}
          wifiConfig={wifiConfig}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {showDelete && (
        <Alert variant="danger">
          <Alert.Heading>Confirm WiFi Network Deletion?</Alert.Heading>
          <p>
            This will delete this Network and all of its settings. You can not
            undo this.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            {isLoading ? (
              <Spinner animation="border" />
            ) : (
              <>
                <Button
                  variant="outline-success"
                  className="me-2"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  Confirm
                </Button>
                <Button variant="outline-danger" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Alert>
      )}
    </Card>
  );
};
