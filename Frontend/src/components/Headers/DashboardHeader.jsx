import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function DashboardHeader() {
  return (
    <div className="flex items-center pl-5 pr-5 pt-1 pb-1 justify-between bg-white text-white shadow-sm box-border">
      {/* Search Bar with Icon */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <img src="/_fb_logo.png" alt="logo" className="w-10 h-10" />
        <div className="flex items-center px-3 py-1 rounded-3xl border border-gray-300 bg-gray-100 text-[#1c1e21]">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
          <input
            type="text"
            className="bg-transparent outline-none placeholder-gray-400"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Icons Section */}
      <div className="flex gap-4">
        {/* Home Icon with Border */}
        <div className="w-12 h-12 flex items-center justify-center border-2 rounded-full">
          <FontAwesomeIcon icon={faHouse} size="xl" className="text-gray-300" />
        </div>
      </div>
      <div>
        <div className="w-10 h-10 flex justify-center items-center border-1 border-[#1c1e21] rounded-4xl">
          <img src="_/" alt="profile_icon" />
        </div>
      </div>
    </div>
  );
}
