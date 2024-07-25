import { lazy, Suspense, useState } from "react";
import { useRouter } from "next/router";
import { createUser } from "../utils/api";
import Loader from "../../components/loader";

const Layout = lazy(() => import("../../components/layout"));

const generatePermalink = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CreateUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

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
    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const permalink = generatePermalink(name);
    try {
      await createUser({ name, email, password, permalink });
      router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ global: "Failed to create user. Please try again later." });
    }
  };

  return (
    <Suspense fallback={<Loader/>}>
      <Layout heading="New User">
        <div className="flex justify-center items-center  p-4">
          <div className="bg-gray-200 shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-extrabold mb-6 text-gray-800">Create New User</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.global && <p className="text-red-600 mb-4 text-center">{errors.global}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full p-3 border rounded-md shadow-sm ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full p-3 border rounded-md shadow-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full p-3 border rounded-md shadow-sm ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
};

CreateUserForm.displayName = 'CreateUserForm';
export default CreateUserForm;
