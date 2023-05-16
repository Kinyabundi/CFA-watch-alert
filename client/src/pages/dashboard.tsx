import axios from "axios";
import { useEffect, useState } from "react";
import { IInfoAlert } from "../types/Alerts";
import { BsPersonPlus } from "react-icons/bs";
import {
  Text,
  Box,
  Flex,
  SimpleGrid,
  Button,
  Icon,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import Modal from "../components/modal";
import toast from "react-hot-toast";
import { IInfoCFA } from "../types/cfa";

export default function Dashboard() {
  const [infoAlerts, setInfoAlerts] = useState<IInfoAlert[]>([]);
  const [infoCFA, setInfoCFA] = useState<IInfoCFA[]>([]);
  //   const setIsOpen = useModal((state) => state.setIsOpen);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);


  const getData = async () => {
    const resp = await axios.get("https://5000-kinyabundi-cfawatchaler-ostnrfapdao.ws-eu97.gitpod.io/get-alerts");
    //console.log(resp?.data?.data);
    if (resp?.status === 200) {
      const data = resp?.data?.data as IInfoAlert[];
      setInfoAlerts(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const getCFA = async () => {
    const resp = await axios.get("https://5000-kinyabundi-cfawatchaler-ostnrfapdao.ws-eu97.gitpod.io/get-cfaMember");
    console.log(resp.data);
    if (resp?.status === 200) {
      const CFAinfo = resp?.data
      //console.log(CFAinfo)
      setInfoCFA(CFAinfo);
    }
  }
  useEffect(() => {
    getCFA();
  }, [])
 

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
          leftIcon={<Icon as={BsPersonPlus} w={4} h={4} />}
          transition={
            "background-color 0.2s ease-in-out, color 0.2s ease-in-out"
          }
        >
          Add CFA Member
        </Button>
        <SimpleGrid
          columns={[2, 3, 4, 4]}
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
            Location
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
      <Modal isOpen={isOpen} onClose={onClose} />
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
        columns={[2, 3, 4, 4]}
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
          {item?.date}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.Time}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.area}
        </Text>
        <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.900"}>
          {item?.Count}
        </Text>

      </SimpleGrid>

    </>
  );
};


