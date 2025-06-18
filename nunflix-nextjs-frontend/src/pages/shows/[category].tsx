import { useRouter } from 'next/router';
import CategoryPage from '@/components/CategoryPage/CategoryPage';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const ShowCategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;

  if (!category) {
    return <LoadingSpinner />;
  }

  return <CategoryPage mediaType="tv" filter={category as string} />;
};

export default ShowCategoryPage;
