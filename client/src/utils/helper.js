
export const updateUrl = (
  router,
  { page = 1, filter = '', search = '', sortOrder = 'asc', sortKey = 'id' } = {}
) => {
  const queryParams = new URLSearchParams({
    page,
    limit: 10,
    filter,
    search,
    sortKey,
    sortOrder
  }).toString();

  router.push(`/?${queryParams}`, undefined, { shallow: false });
};


export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};