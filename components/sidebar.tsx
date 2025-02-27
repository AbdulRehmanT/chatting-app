import { useAuthContext } from "@/lib/AuthContext";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuthContext() || {};

  if (!user) return null;

  return (
    <div className="w-[20%] bg-gray-900 text-white px-3 py-4 relative left-0 h-screen z-10 hidden md:block">
      <h2 className="text-lg text-center font-bold mb-4 sm:text-xs">Members</h2>
      <ul>
        {/* Display the current user's information */}
        <li className="flex items-center gap-2 p-2 border-b border-gray-700">
          <img
            src={
              user?.imageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "User"
              )}`
            }
            alt={user?.username || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div className="lg:block hidden">
            <p className="font-semibold">{user?.username || "Unknown User"}</p>
            <p className="text-xs text-gray-400">{user?.email || "No Email"}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
