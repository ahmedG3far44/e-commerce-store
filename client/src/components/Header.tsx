import Container from "./Container";
import useAuth from "../context/auth/AuthContext";
import { redirect } from "react-router-dom";
import Button from "./Button";

function Header() {
  const { username, logOut } = useAuth();

  const handelLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      logOut();
      return redirect("/");
    } catch (err) {
      console.error(err);
    } finally {
      console.log("ended");
    }
  };
  return (
    <Container>
      <header className="flex justify-between items-center gap-8">
        <h1>logo</h1>
        <nav>
          <ul className="flex justify-center items-center gap-4">
            <li>Home</li>
            <li>About</li>
            <li>terms & conditions</li>
          </ul>
        </nav>
        <div>
          {username ? (
            <div className="flex justify-center items-center gap-4">
              <h3>{username}</h3>
              <button
                className="px-4 py-2 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-800 duration-150"
                onClick={handelLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4">
              <Button variant="primary" to="/login">
                Login
              </Button>
              <Button variant="secondary" to="/signup">
                Create Account
              </Button>
            </div>
          )}
        </div>
      </header>
    </Container>
  );
}

export default Header;
