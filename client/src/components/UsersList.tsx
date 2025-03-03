interface UserListProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  joinUs: string;
}
function UsersList({
  id,
  firstName,
  lastName,
  email,
  isAdmin,
  joinUs,
}: UserListProps) {
  return (
    <div className="w-full p-2 rounded-md bg-gray-50 border border-gray-200 grid grid-cols-5 gap-8">
      <h1 className="text-lg font-semibold">{firstName + " " + lastName}</h1>
      <h4 className="text-sm text-gray-600">{email}</h4>
      <span>{id}</span>
      <span>{isAdmin}</span>
      <span className="ml-auto text-gray-800 font-semibold">
        {joinUs.split("T")[0]}
      </span>
    </div>
  );
}

export default UsersList;
