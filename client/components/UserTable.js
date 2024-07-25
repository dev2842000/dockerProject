import { useRouter } from "next/router";
import { memo } from "react";

const UserTable = memo(({ users }) => {
  const router = useRouter();

  const handleRowClick = (id) => {
    router.push(`/${id}`, undefined, { shallow: true });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permalink</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-sm text-gray-500">{user.permalink}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className={`font-semibold px-6 py-4 text-sm ${user.enabled ? 'text-green-600' : 'text-red-600'}`}>{user.enabled ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

UserTable.displayName = 'UserTable';
export default UserTable;
