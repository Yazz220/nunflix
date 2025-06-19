import * as Sentry from "@sentry/nextjs";
import Link from 'next/link';
import styles from '@/styles/ExplorePage.module.css';

const CustomErrorComponent = ({ statusCode }) => {
  return (
    <div className={styles.explorePageContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </h1>
        <p>Sorry, something went wrong. Please try again later.</p>
        <Link href="/">
          Go back home
        </Link>
      </main>
    </div>
  );
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return { statusCode: contextData.res ? contextData.res.statusCode : contextData.err ? contextData.err.statusCode : 404 };
};

export default CustomErrorComponent;
