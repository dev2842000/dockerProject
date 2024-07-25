import { useRouter } from "next/router";
import { useState, useEffect, Suspense, lazy } from "react";
import { fetchUserById, updateUser, deleteUser } from "../../utils/api";
import Loader from "../../../components/loader";
import { toast } from 'react-toastify';

const Layout = lazy(() => import("../../../components/layout"));

const UpdateUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await fetchUserById(id);
          setUser(data);
          setName(data.name);
          setEmail(data.email);
          setEnabled(data.enabled);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user data. Please try again later.");
        }
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }
    if (!email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      const currentUser = await fetchUserById(id);
      const changes = {
        name: currentUser.name !== name ? name : undefined,
        email: currentUser.email !== email ? email : undefined,
        enabled: currentUser.enabled !== enabled ? enabled : undefined,
      };

      const updatedFields = Object.fromEntries(
        Object.entries(changes).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(updatedFields).length === 0) {
        toast.warn("No changes detected.");
        router.push(`/${id}`);
        return
      }
      
      await updateUser(id, { name, email, enabled });
      toast.success("User updated successfully!");
      router.push(`/${id}`);
    } catch (error) {
      console.warn("Error updating user:", error);
      toast.warn("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id)
        toast.success("User deleted successfully!");
        router.push("/");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this?")) {
      try {
        router.push(`/${id}`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (!user) return <Loader/>;

  return (
    <Suspense fallback={<Loader/>}>
      <Layout heading={`Update User ${user.name}`}>
        <div className="container mx-auto p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="mr-2"
                />
                Enabled
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-green-500 text-white p-2 rounded-md ml-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-md ml-2"
            >
              Delete
            </button>
          </form>
        </div>
      </Layout>
    </Suspense>
  );
};

UpdateUserPage.displayName = 'UpdateUserPage';
export default UpdateUserPage;
