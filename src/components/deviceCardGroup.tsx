import React from "react";
import { CardGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {DeviceCard} from "./deviceCard";
import {BaseClientData} from "../data/DeviceData";

interface Props {
  intfc: string;
  data: BaseClientData[]
}

export const DeviceCardGroup = ({ intfc, data }: Props) => {
  console.log(data);
  return (
    <CardGroup>
      {data.map((device, i) => (
        <DeviceCard key={i} intfc={intfc} data={device} />
      ))}
    </CardGroup>
  );
};
