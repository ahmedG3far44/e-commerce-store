import Container from "./Container";
import Logo from "./Logo";

function Footer() {
  return (
    <div className="bg-blue-900 w-full flex flex-col  items-center gap-4 mt-10">
      <Container>
        <div className="flex items-start justify-between">
          <Logo />
          <ul>
            <li>privacy policy</li>
            <li>terms & conditions</li>
          </ul>
          <div>
            <button>Join us now</button>
          </div>
        </div>
      </Container>
      <div className="p-4 text-gray-400">
        <p>all right's are reserved 2025</p>
      </div>
    </div>
  );
}

export default Footer;
