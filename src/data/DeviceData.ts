export interface DeviceData {
    clients: ClientsData;
}

export interface ClientsData {
    '2.4ghz': WirelessClientData[];
    '5.0ghz': WirelessClientData[];
    ethernet: BaseClientData[];
}

export interface BaseClientData {
    connected: boolean;
    ipv4: string | undefined;
    ipv6: string[] | undefined;
    mac: string | undefined;
    name: string | undefined;
}

export interface WirelessClientData extends BaseClientData {}
