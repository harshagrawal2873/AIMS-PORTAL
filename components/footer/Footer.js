import Link from "next/link";
import Map from "@/components/map/Map";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4 sm:px-6 shadow-lg">
      <div className="flex flex-wrap justify-between space-y-6 sm:space-y-0">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6 items-center lg:items-start text-center lg:text-left">
          <section>
            <p className="text-base sm:text-lg">
              <strong>AIMS Portal</strong>
              <br />
              Made for students and faculty!
            </p>
          </section>
          <div className="w-full sm:w-3/4 lg:w-10/12">
            <Map />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h6 className="footer-title font-bold mb-3 text-lg">
              Useful Links
            </h6>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.sgsitsindore.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  SGSITS Main Site
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.sgsitsindore.in/it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  IT Website
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Feedback Form
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="footer-title font-bold mb-3 text-lg">
              Contact Details
            </h6>
            <p className="text-sm sm:text-base">
              SGSITS Main Campus, Indore , M.P
            </p>
            <p className="mt-3 text-sm sm:text-base">
              Email: info@sgsits.ac.in
            </p>
            <p className="text-sm sm:text-base">Phone: +91-123-456-7890</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
