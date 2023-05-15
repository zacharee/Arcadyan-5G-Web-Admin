export interface MainData {
    device: DeviceData;
    signal: SignalData;
    time: TimeData;
}

export interface DeviceData {
    friendlyName: string;
    hardwareVersion: string;
    isEnabled: boolean;
    isMeshSupported: boolean;
    macId: string;
    manufacturer: string;
    model: string;
    name: string;
    role: string;
    serial: string;
    softwareVersion: string;
    type: string;
    updateState: string;
}

export interface SignalData {
    '4g': CellData;
    '5g': CellData;
    generic: GenericData;
}

export interface CellData {
    bands: string[] | undefined;
    bars: number | undefined;
    cid: number | undefined;
    eNBID: number | undefined;
    rsrp: number | undefined,
    rsrq: number | undefined;
    rssi: number | undefined;
    sinr: number | undefined;
}

export interface GenericData {
    apn: string;
    hasIPv6: boolean;
    registration: string;
    roaming: boolean;
}

export interface TimeData {
    daylightSavings: {
        isUsed: boolean;
    } | undefined;
    localTime: number | undefined;
    localTimeZon: string | undefined;
    upTime: number | undefined;
}
