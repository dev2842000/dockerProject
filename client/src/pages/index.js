import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchUsers } from "../utils/api";
import styles from "../styles/Users.module.css";
import { debounce, updateUrl } from "../utils/helper";
import SelectInput from "../../components/selectInput";

const CustomInput = lazy(() => import("../../components/Input"));
const Loader = lazy(() => import("../../components/loader"));
const UserTable = lazy(() => import("../../components/UserTable"));
const Pagination = lazy(() => import("../../components/pagination"));
const Layout = lazy(() => import("../../components/layout"));

const Users = ({ initialData, initialPage }) => {
  const router = useRouter();

  const [users, setUsers] = useState(initialData.users);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [queryParams, setQueryParams] = useState({
    filter: router.query.filter || "",
    search: router.query.search || "",
    sortOrder: router.query.sortOrder || "asc",
    sortKey: router.query.sortKey || "name",
  });

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const data = await fetchUsers(
          currentPage,
          10,
          queryParams.filter,
          queryParams.search,
          queryParams.sortOrder,
          queryParams.sortKey
        );
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }, 300);

    fetchData();
  }, [currentPage, queryParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateUrl(router, {
      page,
      filter: queryParams.filter,
      search: queryParams.search,
      sortOrder: queryParams.sortOrder,
      sortKey: queryParams.sortKey,
    });
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setQueryParams((prev) => ({
      ...prev,
      filter: newFilter,
    }));
    setCurrentPage(1);
    updateUrl(router, {
      page: 1,
      filter: newFilter,
      search: queryParams.search,
      sortOrder: queryParams.sortOrder,
      sortKey: queryParams.sortKey,
    });
  };

  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setQueryParams((prev) => ({
      ...prev,
      search: newSearch,
    }));
    setCurrentPage(1);
    updateUrl(router, {
      page: 1,
      filter: queryParams.filter,
      search: newSearch,
      sortOrder: queryParams.sortOrder,
      sortKey: queryParams.sortKey,
    });
  };

  const handleSortChange = () => {
    const newSortOrder = queryParams.sortOrder === "asc" ? "desc" : "asc";
    setQueryParams((prev) => ({
      ...prev,
      sortOrder: newSortOrder,
    }));
    setCurrentPage(1);
    updateUrl(router, {
      page: 1,
      filter: queryParams.filter,
      search: queryParams.search,
      sortOrder: newSortOrder,
      sortKey: queryParams.sortKey,
    });
  };

  const handleKeyChange = (e) => {
    const newSortKey = e.target.value;
    setQueryParams((prev) => ({
      ...prev,
      sortKey: newSortKey,
    }));
    setCurrentPage(1);
    updateUrl(router, {
      page: 1,
      filter: queryParams.filter,
      search: queryParams.search,
      sortOrder: queryParams.sortOrder,
      sortKey: newSortKey,
    });
  };

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "permalink", label: "Permalink" },
  ];

  const orderOptions = [
    { value: "asc", label: "Asc" },
    { value: "desc", label: "Desc" },
  ];
  return (
    <Suspense fallback={<Loader />}>
      <Layout heading="Users">
        <div className={styles.scrollableContainer}>
          <div className="mb-4 flex justify-between items-center">
            <CustomInput
              type="text"
              placeholder="Search..."
              value={queryParams.search}
              onChange={handleSearchChange}
              className="border p-2 rounded"
              label="Search"
            />
            <CustomInput
              type="text"
              placeholder="e.g- name:John"
              value={queryParams.filter}
              onChange={handleFilterChange}
              className="border p-2 rounded"
              label={"Filter"}
            />
            <SelectInput
              value={queryParams.sortKey}
              onChange={handleKeyChange}
              options={sortOptions}
              label="Sort By"
              className="w-full"
            />
            <SelectInput
              value={queryParams.sortOrder}
              onChange={handleSortChange}
              options={orderOptions}
              label="Sort By"
              className="w-full"
            />
            
          </div>
          <UserTable users={users} />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Layout>
    </Suspense>
  );
};

export const getServerSideProps = async (context) => {
  const { page = 1, sortOrder = "asc", filter, search } = context.query;

  try {
    const data = await fetchUsers(page, 10, search, filter, sortOrder);

    const safeData = {
      users: data.users || [],
      totalPages: data.totalPages || 0,
    };

    return {
      props: {
        initialData: safeData,
        initialPage: parseInt(page, 10),
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        initialData: {
          users: [],
          totalPages: 0,
        },
        initialPage: 1,
      },
    };
  }
};

export default Users;
