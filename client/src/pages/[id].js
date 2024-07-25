import { useRouter } from "next/router";
import { lazy, Suspense, useEffect, useState } from "react";
import { fetchUserById } from "../utils/api";
import Loader from "../../components/loader";
import Head from "next/head";

const Layout = lazy(() => import("../../components/layout"));

const UserSinglePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = () => {
    if (id) {
      router.push(`/updateUser/${id}`);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Oops! {error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <Suspense fallback={<Loader />}>
      <Head>
        <title>User Profile - {user.name}</title>
        <meta name="description" content={`Profile of ${user.name}`} />
      </Head>
      <Layout heading={`User ${user.name}`}>
        <div className="flex flex-col justify-center items-center bg-gray-100 py-10 px-4">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
                {user.name}
              </h1>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Enabled:</span>
                <span
                  className={`font-semibold ${
                    user.enabled ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.enabled ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Created At:</span>
                <span className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Updated At:</span>
                <span className="text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              aria-label={`Update user ${user.name}`}
              role="button"
            >
              Update
            </button>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
};

UserSinglePage.displayName = "UserSinglePage";
export default UserSinglePage;
