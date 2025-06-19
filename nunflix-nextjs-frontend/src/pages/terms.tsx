import type { NextPage } from 'next';
import Head from 'next/head';

const TermsOfServicePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Terms of Service - Nunflix</title>
        <meta name="description" content="Terms of Service for Nunflix" />
      </Head>
      <main style={{ padding: '20px', lineHeight: '1.6' }}>
        <h1>Terms of Service for Nunflix</h1>
        <p>Last Updated: June 15, 2025</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these Terms. If you disagree
          with any part of the terms, then you may not access the service.
        </p>

        <h2>2. Accounts</h2>
        <p>
          When you create an account with us, you must provide us with information that is accurate,
          complete, and current at all times. Failure to do so constitutes a breach of the Terms,
          which may result in immediate termination of your account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for
          any activities or actions under your password, whether your password is with our Service or
          a third-party service.
        </p>

        <h2>3. Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make available certain
          information, text, graphics, videos, or other material ("Content"). You are responsible for
          the Content that you post to the Service, including its legality, reliability, and appropriateness.
        </p>
        <p>
          Nunflix does not host any of the video content. The site provides links to content hosted by
          third-party services. Users are responsible for ensuring they have the right to access any
          content linked through Nunflix.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features and
          functionality are and will remain the exclusive property of Nunflix and its licensors.
        </p>

        <h2>5. Links To Other Web Sites</h2>
        <p>
          Our Service may contain links to third-party web sites or services that are not owned or
          controlled by Nunflix. Nunflix has no control over, and assumes no responsibility for,
          the content, privacy policies, or practices of any third-party web sites or services.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability,
          for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>7. Limitation Of Liability</h2>
        <p>
          In no event shall Nunflix, nor its directors, employees, partners, agents, suppliers,
          or affiliates, be liable for any indirect, incidental, special, consequential or punitive
          damages, including without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h2>8. Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and
          "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether
          express or implied. Nunflix does not warrant that a) the Service will function uninterrupted,
          secure or available at any particular time or location; b) any errors or defects will be
          corrected; c) the Service is free of viruses or other harmful components; or d) the results
          of using the Service will meet your requirements.
        </p>
        <p>
          Nunflix is a search engine for content available on the internet and does not host or upload any videos or films itself.
          It is not responsible for the accuracy, compliance, copyright, legality, decency, or any other aspect of the content of other linked sites.
          If you have any legal issues please contact the appropriate media file owners or host sites.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction],
          without regard to its conflict of law provisions.
        </p>

        <h2>10. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
          If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@nunflix.example.com.
        </p>
        <p>
          <em>(This is a template. Please consult with a legal professional to ensure your Terms of Service are complete and compliant.)</em>
        </p>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
