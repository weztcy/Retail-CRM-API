export function getPagination(
  page?: string | null,
  limit?: string | null
) {

  const currentPage = Number(page) || 1;

  const perPage = Number(limit) || 10;


  return {
    skip: (currentPage - 1) * perPage,
    take: perPage,
    page: currentPage,
    limit: perPage,
  };

}