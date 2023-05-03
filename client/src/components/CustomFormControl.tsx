// imports
import {
    FormControl,
    FormLabel,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Select,
  } from "@chakra-ui/react";
  import { FC, useState } from "react";
  import { ICustomFormControl, IOption } from "../types/FormControl";
  import { MdOutlineRemoveRedEye } from "react-icons/md";
  import { RiEyeCloseLine } from "react-icons/ri";
  
  const CustomFormControl: FC<ICustomFormControl> = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    variant = "input",
    options,
    isDisabled = false,
    setValue,
  }) => {
    const [show, setShow] = useState(false);
    const handlePasswordInput = () => setShow(!show);
  
    return (
      <FormControl px={4} py={3}>
        <FormLabel>{label}</FormLabel>
        {variant === "input" && (
          <InputGroup>
            <Input
              type={!show && type === "password" ? "password" : "text"}
              value={value}
              placeholder={placeholder}
              onChange={(e) =>
                !onChange && !setValue
                  ? () => {}
                  : onChange
                  ? onChange(e)
                  : setValue
                  ? setValue(e.target.value)
                  : () => {}
              }
              disabled={isDisabled}
            />
            {type === "password" && (
              <InputRightElement display="flex" alignItems="center">
                <Icon
                  color="gray.600"
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handlePasswordInput}
                />
              </InputRightElement>
            )}
          </InputGroup>
        )}
  
        {variant === "select" && (
          <Select
            size="md"
            placeholder="Choose ..."
            disabled={isDisabled}
            value={value}
            onChange={(e) => (!onChange ? null : onChange(e))}
          >
            {options &&
              // @ts-ignore
              (options[0] as IOption).label &&
              (options as IOption[]).map((opt) => (
                // @ts-ignore
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            {options &&
              !(options[0] as IOption).label &&
              (options as string[]).map((opt) => (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              ))}
          </Select>
        )}
      </FormControl>
    );
  };
  
  export default CustomFormControl;
  