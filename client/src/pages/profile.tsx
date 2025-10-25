import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapPin,
  FaBriefcase,
  FaHome,
  FaCamera,
  FaTrash,
  FaSave,
  FaEdit,
  FaMailBulk,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";

import Container from "../components/Container";

function ProfilePage() {
  const [user, setUser] = useState({
    name: "Mahmoud Gaafar",
    email: "mahmoud@example.com",
    phone: "+20 123 456 7890",
    profileImage: "",
    addresses: [
      {
        id: 1,
        type: "OFFICE",
        street: "247 st, El-Mandara",
        city: "Alexandria",
        isEditing: false,
      },
      {
        id: 2,
        type: "HOME",
        street: "city center",
        city: "Alexandria",
        isEditing: false,
      },
      {
        id: 3,
        type: "HOME 2",
        street: "247 st, El-Mandara",
        city: "Alexandria",
        isEditing: false,
      },
      {
        id: 4,
        type: "OFFICE 2",
        street: "738743 st, El-RAML",
        city: "Alexandria",
        isEditing: false,
      },
    ],
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...user });
  const [newAddress, setNewAddress] = useState({
    type: "",
    street: "",
    city: "",
    isAdding: false,
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setTempProfile({ ...tempProfile, profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const toggleProfileEdit = () => {
    if (isEditingProfile) {
      setTempProfile({ ...user });
    } else {
      setTempProfile({ ...user });
    }
    setIsEditingProfile(!isEditingProfile);
  };
  const saveProfileChanges = () => {
    setUser({ ...tempProfile });
    setIsEditingProfile(false);
  };
  const toggleAddressEdit = (id: number) => {
    setUser({
      ...user,
      addresses: user.addresses.map((addr) =>
        addr.id === id ? { ...addr, isEditing: !addr.isEditing } : addr
      ),
    });
  };
  const updateAddress = (id: number, field: string, value: string) => {
    setUser({
      ...user,
      addresses: user.addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      ),
    });
  };
  const saveAddressChanges = (id: number) => {
    toggleAddressEdit(id);
  };
  const removeAddress = (id: number) => {
    setUser({
      ...user,
      addresses: user.addresses.filter((addr) => addr.id !== id),
    });
  };
  const toggleAddAddress = () => {
    setNewAddress({
      type: "",
      street: "",
      city: "",
      isAdding: !newAddress.isAdding,
    });
  };
  const updateNewAddress = (field: string, value: string) => {
    setNewAddress({
      ...newAddress,
      [field]: value,
    });
  };
  const addNewAddress = () => {
    if (newAddress.type && newAddress.street && newAddress.city) {
      const newId = Math.max(...user.addresses.map((a) => a.id), 0) + 1;
      setUser({
        ...user,
        addresses: [
          ...user.addresses,
          {
            id: newId,
            type: newAddress.type,
            street: newAddress.street,
            city: newAddress.city,
            isEditing: false,
          },
        ],
      });
      toggleAddAddress();
    }
  };

  return (
    <Container>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6  border-zinc-200 border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={toggleProfileEdit}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  {isEditingProfile ? (
                    <FaX className="w-4 h-4 mr-1" />
                  ) : (
                    <FaEdit className="w-4 h-4 mr-1" />
                  )}
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row">
              <div className="mb-6 md:mb-0 md:mr-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {(
                    isEditingProfile
                      ? tempProfile.profileImage
                      : user.profileImage
                  ) ? (
                    <img
                      src={
                        isEditingProfile
                          ? tempProfile.profileImage || ""
                          : user.profileImage || ""
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-500" />
                  )}
                </div>

                {isEditingProfile && (
                  <div className="mt-4">
                    <label className="flex items-center justify-center px-4 py-2 bg-blue-600 rounded-md text-white cursor-pointer hover:bg-blue-700">
                      <FaCamera className="w-4 h-4 mr-2" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border-zinc-200-zinc-200 border border-zinc-200  border-zinc-200-zinc-200-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tempProfile.name}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2  border border-zinc-200  border-zinc-200-zinc-200-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tempProfile.email}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tempProfile.phone}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveProfileChanges}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <FaSave className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMailBulk className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6  border-zinc-200 ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Addresses
                </h2>
                <button
                  onClick={toggleAddAddress}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  {newAddress.isAdding ? "Cancel" : "Add Address"}
                </button>
              </div>
              {newAddress.isAdding && (
                <div className="mb-6 p-4 border border-zinc-200 border border-zinc-200-zinc-200 border border-zinc-200 border border-zinc-200-zinc-200-zinc-200 rounded-md bg-gray-50">
                  <h3 className="text-md font-medium mb-4">Add New Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <input
                        type="text"
                        placeholder="HOME, OFFICE, etc."
                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAddress.type}
                        onChange={(e) =>
                          updateNewAddress("type", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAddress.street}
                        onChange={(e) =>
                          updateNewAddress("street", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-zinc-200  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAddress.city}
                        onChange={(e) =>
                          updateNewAddress("city", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={addNewAddress}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-zinc-200 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {address.type.includes("HOME") ? (
                          <FaHome className="w-5 h-5 text-gray-500 mr-2" />
                        ) : (
                          <FaBriefcase className="w-5 h-5 text-gray-500 mr-2" />
                        )}
                        <h3 className="font-medium">{address.type}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            address.isEditing
                              ? saveAddressChanges(address.id)
                              : toggleAddressEdit(address.id)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {address.isEditing ? (
                            <FaSave className="w-4 h-4" />
                          ) : (
                            <FaEdit className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => removeAddress(address.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {address.isEditing ? (
                      <div className="space-y-3 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={address.type}
                            onChange={(e) =>
                              updateAddress(address.id, "type", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-zinc-200  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={address.street}
                            onChange={(e) =>
                              updateAddress(
                                address.id,
                                "street",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={address.city}
                            onChange={(e) =>
                              updateAddress(address.id, "city", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-start">
                          <FaMapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                          <p className="text-gray-700">
                            {address.street}, {address.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;
