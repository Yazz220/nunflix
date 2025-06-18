import { useRouter } from 'next/router';
import CategoryPage from '@/components/CategoryPage/CategoryPage';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const ProviderPage = () => {
  const router = useRouter();
  const { provider } = router.query;

  if (!provider) {
    return <LoadingSpinner />;
  }

  return <CategoryPage mediaType="all" filter={provider as string} />;
};

export default ProviderPage;
