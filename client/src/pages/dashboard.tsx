import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Box,
    FormControl,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Avatar,
    ButtonGroup,
    IconButton,
    Tag,
    TagLabel,
    Td,
    Tooltip,
    Checkbox,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { HiOutlineCloudDownload } from "react-icons/hi";
import { MdAddCircle } from "react-icons/md";
import { TbSearch } from "react-icons/tb";
import { BsEye } from "react-icons/bs";
import { CiTrash } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi"
import { IAlerts } from "../types/Alerts";
import axios from "axios";

const dashboard = () => {
    const [alert, setAlert] = useState<IAlerts[]>([]);


    const getAlerts = async () => {
        const resp = await axios.get("http://localhost:5000/api/query-alerts");
        if (resp?.data?.status === "ok") {
            setAlert(resp.data.data)
        }
    };
    useEffect(() => {
        getAlerts()
    }, [])

    console.log(alert)

    return (
        <>
            <Helmet>
                <title>All Alerts</title>
            </Helmet>
            <Box px={8}>
                <Flex justify={"space-between"} align={"center"} mb={8} w={"full"}>
                    <Text fontSize={"2xl"} fontWeight={"semibold"}>
                        All Alerts
                    </Text>
                    {/* <Text>Cooperative Profile</Text> */}
                </Flex>
                <Flex justify={"space-between"} align={"center"} mb={8} w={"full"}>
                    <FormControl id="name">
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={TbSearch} w={4} h={4} />
                            </InputLeftElement>

                            <Input
                                type="text"
                                color={"gray.500"}
                                placeholder={"Search for a farmer ..."}
                                fontSize="sm"
                                fontWeight="500"
                                size="md"
                                focusBorderColor="navyblue"
                                borderColor={"gray.300"}
                                borderWidth={1}
                                _focus={{
                                    borderColor: "gray.100",
                                    borderWidth: 1,
                                }}
                                w={"60%"}
                                borderRadius={25}
                                bg={"white"}
                            />
                        </InputGroup>
                    </FormControl>
                    <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                leftIcon={<HiOutlineCloudDownload />}
                                rightIcon={<ChevronDownIcon />}
                                colorScheme={"whiteAlpha"}
                                color={"black"}
                                w={"full"}
                            >
                                Download
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Excel (.xlsx)</MenuItem>
                                <MenuItem>CSV (.csv)</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
                <Box bg={"white"} p={8} borderRadius={8}>
                    <Flex align={"center"} justify={"space-between"} mb={8}>
                        <Text>
                            Showing <b>1</b> to <b>10</b> of <b>100</b> entries
                        </Text>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                colorScheme={"gray"}
                                color={"black"}
                            >
                                Filter
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Name</MenuItem>
                                <MenuItem>Location</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>
                                        <Checkbox />
                                    </Th>
                                    <Th>Dates</Th>
                                    <Th>Time</Th>
                                    <Th>Count</Th>
                                    <Th>Location</Th>
                                    {/* <Th>Total Collection</Th> */}
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {alert.length > 0 ? (
                                    <>
                                        {alert.map((item, i) => (
                                            <Tr key={i}>
                                                <Td>
                                                    <Checkbox />
                                                </Td>
                                                <Td>
                                                    <Flex align={"center"}>
                                                        <Avatar
                                                            size={"sm"}
                                                            name={item.alert_date}
                                                            src={
                                                                "https://images.unsplash.com/photo-1556740752-6f9a6d6d7b61?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhaW5pbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                                                            }
                                                        />
                                                        <Box ml={"4"}>
                                                            <Box as="span" color={"gray.600"} fontSize={"sm"}>
                                                                {item.alert_date}
                                                            </Box>
                                                            <Box>
                                                                <Box
                                                                    as="span"
                                                                    color={"gray.600"}
                                                                    fontSize={"sm"}
                                                                >
                                                                    {item.alert_time}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Flex>
                                                </Td>
                                                <Td>
                                                    <Box as="span" color={"gray.600"} fontSize={"sm"}>
                                                        {item.alert_count}
                                                    </Box>
                                                </Td>
                                                <Td>
                                                    <Box as="span" color={"gray.600"} fontSize={"sm"}>
                                                        {item?.longitude} {item?.latitude}
                                                    </Box>
                                                </Td>

                                            </Tr>
                                        ))}
                                    </>
                                ) : (
                                    <Text textAlign={"center"} mt={3}>No Alerts.</Text>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
};

export default dashboard;
