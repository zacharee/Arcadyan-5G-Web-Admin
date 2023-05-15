import React, {useCallback, useContext, useState} from "react";
import {Button, ButtonGroup, Card, Container, Row, ToggleButton} from "react-bootstrap";
import {setWifiData} from "../modules/services";
import {AuthContext} from "../context/AuthContext";
import {WifiConfig} from "../data/WifiConfig";

interface Props {
    wifiConfig: WifiConfig | null | undefined;
    isLoading: boolean;
    setIsLoading: (boolean) => void;
}

export const WifiRadioCard = ({
    wifiConfig,
    isLoading,
    setIsLoading,
}: Props) => {
    const { user } = useContext(AuthContext);

    const [is2GHzEnabled, setIs2GHzEnabled] = useState(wifiConfig?.["2.4ghz"]?.isRadioEnabled);
    const [is5GHzEnabled, setIs5GHzEnabled] = useState(wifiConfig?.["5.0ghz"]?.isRadioEnabled);

    const apply = useCallback(() => {
        setIsLoading(true);
        
        const newConfig: WifiConfig = {
            ...wifiConfig,
            '2.4ghz': {
                ...wifiConfig?.['2.4ghz'],
                isRadioEnabled: is2GHzEnabled,
            },
            '5.0ghz': {
                ...wifiConfig?.['5.0ghz'],
                isRadioEnabled: is5GHzEnabled,
            },
        }

        setWifiData(user?.token, newConfig)
            .then((responseData) => {
                setIsLoading(false);
                console.log(responseData);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error.toJSON());
            });
    }, [is2GHzEnabled, is5GHzEnabled, setIsLoading, user?.token, wifiConfig]);

    return (
        <Card bg="dark" text="light" className="m-2 rounded shadow">
            <Card.Body>
                <Card.Title>Radio Settings</Card.Title>

                <Container>
                    <ButtonGroup className="mb-2">
                        <ToggleButton
                            id={"toggle-2ghz"}
                            type="checkbox"
                            value="1"
                            variant={"outline-primary"}
                            checked={is2GHzEnabled}
                            onChange={v => setIs2GHzEnabled(v.currentTarget.checked)}>2.4GHz Radio</ToggleButton>

                        <ToggleButton
                            id={"toggle-5ghz"}
                            type="checkbox"
                            variant={"outline-primary"}
                            value="1"
                            checked={is5GHzEnabled}
                            onChange={v => setIs5GHzEnabled(v.currentTarget.checked)}>5GHz Radio</ToggleButton>
                    </ButtonGroup>

                    <Row>
                        <Button value="Apply" onClick={() => apply()} disabled={isLoading}>Apply</Button>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
};
