import Container from "./Container";
import Logo from "./Logo";

function Footer() {
  return (
    <div className="bg-blue-700 text-gray-200 w-full flex flex-col  items-center gap-4 mt-10">
      <Container>
        <div className="w-full flex justify-center items-start">
          <Logo status="footer" />
        </div>
      </Container>
      <div className="p-4 text-gray-200">
        <p>all right's are reserved 2025</p>
      </div>
    </div>
  );
}

export default Footer;
