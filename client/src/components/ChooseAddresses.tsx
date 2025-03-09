import { useState } from "react";

interface ChooseAddressProps {
  userAddress: string[];
  setUserAddress: (address: string) => void;
}
function ChooseAddresses({ userAddress, setUserAddress }: ChooseAddressProps) {
  const [address, setAddresses] = useState<string[]>(userAddress);
  const [activeShippedAddress, setActiveAddress] = useState<string>("");

  return (
    <div className="w-1/2 m-auto flex flex-col justify-start items-start gap-2">
      {address.map((address) => {
        return (
          <div
            role="button"
            onClick={() => {
              setActiveAddress(address);
              setUserAddress(activeShippedAddress);
            }}
            className={` p-4 rounded-md  border w-full border-gray-400 hover:bg-blue-100 cursor-pointer  duration-150 text-gray-700 ${
              activeShippedAddress === address
                ? "bg-blue-100 border-blue-600"
                : ""
            }`}
          >
            <h1>{address}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default ChooseAddresses;
