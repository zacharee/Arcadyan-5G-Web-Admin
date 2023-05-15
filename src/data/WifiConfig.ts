export interface WifiConfig {
    '2.4ghz': BandConfig;
    '5.0ghz': BandConfig;
    bandSteering: BandSteeringConfig;
    ssids: SSIDConfig[];
}

export interface BandConfig {
    airtimeFairness: boolean;
    channel: number | "Auto";
    channelBandwidth: number | "Auto";
    isMUMIMOEnabled: boolean;
    isRadioEnabled: boolean;
    isWMMEnabled: boolean;
    maxClients: number;
    mode: string;
    transmissionPower: string;
}

export interface BandSteeringConfig {
    isEnabled: boolean;
}

export interface SSIDConfig {
    '2.4ghzSsid': boolean;
    '5.0ghzSsid': boolean;
    encryptionMode: string;
    encryptionVersion: string;
    guest: boolean;
    isBroadcastEnabled: boolean;
    ssidName: string | undefined;
    wpaKey: string | undefined;
}
