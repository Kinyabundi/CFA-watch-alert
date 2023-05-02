import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useModal } from "../hooks/useModal";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function JoinModal() {
  const isOpen = useModal((state) => state.isOpen);
  const setIsOpen = useModal((state) => state.setIsOpen);

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");

  const resetFields = () => {
    setEmail("");
    setName("");
    setPhoneNo("");
  };

  const onClose = () => setIsOpen(false);

  const clickSubmit = async () => {
    // email regex
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !name) {
      toast.error("Please fill your email and name");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (phoneNo.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // submit data to backend
    const id = toast.loading("Adding user to waitlist...");
    try {
      const res = await axios.post("https://antugrow-canvas-backend.vercel.app/save-waitlist", {
        email,
        name,
        phoneNo,
      });
      if (res.status === 201) {
        toast.success("You have been added to the waitlist");
        resetFields();
        onClose();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => {
        toast.dismiss(id);
      }, 3000);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Join The Waitlist
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Your Name
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Joe Allen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Your Email
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="joe.allen@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Your Phone No
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="0712562611"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={clickSubmit}
                      className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
