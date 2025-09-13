// pages/Profile.tsx
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button
        onClick={() => {
          logout();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }}
        className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
