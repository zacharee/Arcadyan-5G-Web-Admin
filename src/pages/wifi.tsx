import React, {useState, useEffect, useContext, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container, Row, Spinner} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {WifiCard} from "../components/wifiCard";
import { getWifiData, loginUser } from "../modules/services";
import {WifiRadioCard} from "../components/wifiRadioCard";
import {WifiConfig} from "../data/WifiConfig";

export const WiFi = () => {
  const { user, setUser } = useContext(AuthContext);
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  /**
   * Get Wifi Data. Login if token expires
   */
  const getData = useCallback(() => {
    setIsLoading(true);
    getWifiData(user.token)
      .then((wifiData) => {
        setWifiConfig(wifiData);
        setIsLoading(false);
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
  }, [setUser, user.password, user.token]);
  /**
   * Call Get Data on load if if user token exists. Send to login page otherwise. Refresh on changes to User State
   */
  useEffect(() => {
    if (user) {
      getData();
      const interval = setInterval(() => {
        getData();
      }, 20000);
      return () => clearInterval(interval);
    } else {
      navigate("/login", { replace: true });
    }
  }, [getData, navigate, user]);
  /**
   * Return JSX
   */
  return (
    <Container>
      <Row>
        <WifiRadioCard
            wifiConfig={wifiConfig}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
      </Row>

      {wifiConfig ? (
        Object.keys(wifiConfig.ssids).map((key, index) => {
          return (
            <Row>
              <WifiCard
                  key={index}
                  cardIndex={Number(key)}
                  wifiConfig={wifiConfig}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
              />
            </Row>
          );
        })
      ) : (
        <Spinner animation="border" />
      )}
    </Container>
  );
};
