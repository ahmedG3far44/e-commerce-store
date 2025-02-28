import useAuth from "../context/auth/AuthContext";
import Container from "../components/Container";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <Container>
      <div className="flex flex-col justify-start items-center">
        <h1>Profile Page</h1>
        <p>Welcome {(user?.firstName, user?.lastName)}</p>
        <h1>show user address</h1>
        <ul>
          <li>-edit address </li>
          <li>- show number of order</li>
          <li>- add phone number</li>
        </ul>
      </div>
    </Container>
  );
}

export default ProfilePage;
