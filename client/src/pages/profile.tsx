import useAuth from "../context/auth/AuthContext";
import Container from "../components/Container";

function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <Container>
      <div className="flex flex-col justify-start items-center">
        <h1>Profile Page</h1>
        <p>Welcome {(user?.firstName, user?.lastName)}</p>
      </div>
    </Container>
  );
}

export default ProfilePage;
