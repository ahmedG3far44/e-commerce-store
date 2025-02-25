import useAuth from "../context/AuthContext";
import Container from "../components/Container";

function ProfilePage() {
  const { username } = useAuth();

  return (
    <Container>
      <div className="flex flex-col justify-start items-center">
        <h1>Profile Page</h1>
        <p>Welcome {username}</p>
      </div>
    </Container>
  );
}

export default ProfilePage;
