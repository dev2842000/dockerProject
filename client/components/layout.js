import { useRouter } from 'next/router';
import Link from 'next/link';

const Layout = ({ children, heading }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1>Logo</h1>
          </Link>
        </div>
        <h1 className="text-xl font-bold flex-grow text-center">{heading}</h1>
        {router.pathname !== '/createUser' && (
          <Link href="/createUser" legacyBehavior>
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Create User
            </a>
          </Link>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        &copy; {new Date().getFullYear()} Your Company
      </footer>
    </div>
  );
};

export default Layout;
