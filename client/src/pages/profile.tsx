import useAuth from "../context/auth/AuthContext";
import Container from "../components/Container";
import { useState } from "react";

function ProfilePage() {
  const { user } = useAuth();
  const [editState, setEditState] = useState(false);

  const address = [
    {
      id: 1,
      name: "OFFICE",
      address: "247 st, El-Mandara, Alexandria",
    },
    {
      id: 2,
      name: "HOME",
      address: "city center,  Alexandria",
    },
    {
      id: 3,
      name: "HOME 2",
      address: "247 st, El-Mandara, Alexandria",
    },
    {
      id: 4,
      name: "OFFICE 2",
      address: "738743 st, El-RAML, Alexandria",
    },
  ];

  const handelShowAddressForm = () => {
    setEditState(true);
  };

  return (
    <Container>
      <div className="flex flex-col justify-start items-center">
        <h1>Profile Page</h1>
        <p>Welcome {(user?.firstName, user?.lastName)}</p>
        <h1>show user address</h1>
        <div className="w-1/2 p-4 border border-gray-200 flex flex-col items-start justify-start gap-4 rounded-md ">
          {address.map(({ name, address, id }) => {
            return (
              <div className="border-b-gray-200 border-b w-full p-2" key={id}>
                {editState ? (
                  <div>
                    <input type="text" placeholder="items cent" />
                    <input type="submit" value={"value"} />
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg font-semibold">{name}</h1>
                    <p className="text-gray-600">{address}</p>
                    <div className="flex justify-start items-center gap-4">
                      <button
                        onClick={handelShowAddressForm}
                        className="border-none bg-transparent underline hover:text-blue-500 duration-150 cursor-pointer"
                      >
                        edit
                      </button>
                      <button className="border-none bg-transparent underline hover:text-blue-500 duration-150 cursor-pointer">
                        remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;
