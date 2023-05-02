import axios from "axios";
import { useEffect, useState } from "react";
import { IInfoAlert } from "../types/Alerts";
import { useModal } from "../hooks/useModal";
import {
  Text,
  Box,
  Flex,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";

export default function Dashboard() {
  const [infoAlerts, setInfoAlerts] = useState<IInfoAlert[]>([]);
  const setIsOpen = useModal((state) => state.setIsOpen);


  const getData = async () => {
    const resp = await axios.get("http://localhost:5000/query-alerts");

    if (resp?.statusText === "OK") {
      const data = resp?.data?.alerts as IInfoAlert[];
      setInfoAlerts(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box px={4} w={"full"}>
                <Flex textTransform={'uppercase'} fontSize="xl"
                    fontFamily="monospace"
                    fontWeight="bold">Alerts
                </Flex>
                <Button
                bg={"gray.200"}
                color={"black"}
                textTransform={"uppercase"}
                fontSize={"xs"}
                _hover={{
                  bg: "gray.300",
                }}
                onClick={() => setIsOpen(true)}
                transition={
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                }
              >
                Add CFA Member
              </Button>
                <SimpleGrid
                    columns={[2, 3, 5, 5]}
                    spacing={4}
                    mt={6}
                    w={"full"}
                    bg={"gray.200"}
                    borderRadius={"lg"}
                    p={4}
                >
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                    Date
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                    Time
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                    Longitude
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                    Latitude
                    </Text>
                    <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
                    Count
                    </Text>

                </SimpleGrid>
                {infoAlerts.length > 0 ? (
                    infoAlerts.map((item, i) => (
                        <AlertItem item={item} key={i} refresh={getData} />
                    ))
                ) : (
                    <Text>No Alerts</Text>
                )}
            </Box>
        </>
    );
}

const AlertItem = ({
    item,
    refresh,
}: {
    item: IInfoAlert;
    refresh?: () => void;
}) => {
    return (
        <>
            <SimpleGrid
                columns={[2, 3, 5, 5]}
                spacing={4}
                mt={6}
                w={"full"}
                bg={"white"}
                borderRadius={"lg"}
                p={4}
                boxShadow={"2xl"}
                cursor={"pointer"}
                _hover={{
                    bg: "gray.100",
                }}
                transition={
                    "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                }
            >
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                {item?.alert__date}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                {item?.alert__time_utc}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                {item?.longitude}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                {item?.latitude}
                </Text>
                <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
                {item?.alert__count}
                </Text>

            </SimpleGrid>

        </>
    );
};


