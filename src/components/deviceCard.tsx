import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {BaseClientData} from "../data/DeviceData";

interface Props {
  intfc: string;
  data: BaseClientData;
}

export const DeviceCard = ({ intfc, data }: Props) => {
  return (
    <Card bg="dark" text="light" className="m-2 rounded shadow ">
      <Card.Body>
        <Card.Title>{data.name ? data.name : "N/A"}</Card.Title>
        <Container>
          <Row>
            <Col>
              <b>Connected</b>
            </Col>
            <Col>
              {data.connected ? (
                <Badge bg="success">Online</Badge>
              ) : (
                <Badge bg="danger">Offline</Badge>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <b>IP</b>
            </Col>
            <Col>{data.ipv4 ? data.ipv4 : "N/A"}</Col>
          </Row>
          <Row>
            <Col>
              <b>Interface</b>
            </Col>
            <Col>{intfc}</Col>
          </Row>
          <Row>
            <Col>
              <b>MAC</b>
            </Col>
            <Col>{data.mac}</Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};
