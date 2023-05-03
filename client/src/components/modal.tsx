import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import CustomFormControl from "./CustomFormControl";
import { nanoid } from "nanoid";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { formatKenyanPhoneNumber, locations } from "../utils/utils";

interface AddCFAProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinModal = ({ isOpen, onClose }: AddCFAProps) => {
  const [nationalId, setNationalId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => {
    setNationalId("");
    setPhoneNo("");
    setEmail("");
    setName("");
    setLocation("");
  };

  const clickSubmit = async () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // kenya phone no regex
    const phoneNoRegex = /^0(\d{9})$/;

    // validate fields
    if (!name || !nationalId || !email || !phoneNo) {
      toast.error("Please fill all fields");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!phoneNoRegex.test(phoneNo)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      // send data to backend
      const res = await axios.post("http://localhost:5000/add-cfaMember", {
          nationalId,
          email,
          name,
          phoneNo: formatKenyanPhoneNumber(phoneNo),
          location,
      });
      if (res.status === 201 ) {
        resetForm();
        onClose();
        toast.success("CFA Member added successfully");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent fontFamily={"Inconsolata"}>
        <ModalHeader>
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Add CFA Member
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CustomFormControl
            label="Name"
            placeholder="Ben Stone"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomFormControl
            label="ID no"
            placeholder="24352617"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
          <CustomFormControl
            label="Email Address"
            placeholder="ben.stone@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomFormControl
            label="Phone No"
            placeholder="0712345678"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          <CustomFormControl
              label="Select Location"
              placeholder="Choose ..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={locations}
              variant="select"
            />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={onClose}
            leftIcon={<GiCancel />}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme={"teal"}
            leftIcon={<FiEdit3 />}
            onClick={clickSubmit}
            isLoading={loading}
            loadingText="Saving"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinModal;
