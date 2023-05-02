import axios from "axios";
import { useEffect, useState } from "react";
import { IInfoAlert } from "../types/Alerts";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";
import MainLayout from "../layout/MainLayout";

export default function Dashboard() {
  const [infoAlerts, setInfoAlerts] = useState<IInfoAlert[]>([]);

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
    <MainLayout>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Longitude</Th>
              <Th>Latitude</Th>
              <Th>Count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {infoAlerts.length > 0 ? (
              infoAlerts.map((item, i) => (
                <Tr key={i}>
                  <Td>{item?.alert__date}</Td>
                  <Td>{item?.alert__time_utc}</Td>
                  <Td>{item?.longitude}</Td>
                  <Td>{item?.latitude}</Td>
                  <Td>{item?.alert__count}</Td>
                </Tr>
              ))
            ) : (
              <Text>No Data Yet</Text>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
}
