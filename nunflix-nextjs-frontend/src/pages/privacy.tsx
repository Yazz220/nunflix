import type { NextPage } from 'next';
import Head from 'next/head';

const PrivacyPolicyPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Privacy Policy - Nunflix</title>
        <meta name="description" content="Privacy Policy for Nunflix" />
      </Head>
      <main style={{ padding: '20px', lineHeight: '1.6' }}>
        <h1>Privacy Policy for Nunflix</h1>
        <p>Last Updated: June 15, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Nunflix ("we," "our," or "us"). We are committed to protecting your personal information
          and your right to privacy. If you have any questions or concerns about this privacy notice, or our
          practices with regards to your personal information, please contact us at privacy@nunflix.example.com.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We may collect personal information that you voluntarily provide to us when you register on the
          Services, express an interest in obtaining information about us or our products and services,
          when you participate in activities on the Services, or otherwise when you contact us.
        </p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
        <ul>
          <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; usernames; passwords; contact preferences; contact or authentication data; billing addresses; debit/credit card numbers; and other similar information.</li>
          <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor and you should review its privacy policies and contact the payment processor directly to respond to your questions.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our Services for a variety of business purposes described below.
          We process your personal information for these purposes in reliance on our legitimate business interests,
          in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        {/* Add more specific uses here */}

        <h2>4. Will Your Information Be Shared With Anyone?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services,
          to protect your rights, or to fulfill business obligations.
        </p>
        {/* Add more details on sharing practices */}

        <h2>5. How Long Do We Keep Your Information?</h2>
        <p>
          We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice
          unless otherwise required by law.
        </p>

        <h2>6. How Do We Keep Your Information Safe?</h2>
        <p>
          We aim to protect your personal information through a system of organizational and technical security measures.
        </p>

        <h2>7. What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the EEA and UK), you have certain rights under applicable data protection laws.
          These may include the right (i) to request access and obtain a copy of your personal information,
          (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and
          (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object
          to the processing of your personal information.
        </p>

        <h2>8. Updates To This Notice</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated
          "Last Updated" date and the updated version will be effective as soon as it is accessible.
        </p>

        <h2>9. How Can You Contact Us About This Notice?</h2>
        <p>
          If you have questions or comments about this notice, you may email us at privacy@nunflix.example.com or by post to:
        </p>
        <p>
          Nunflix<br />
          [Your Company Address Here]<br />
          Attn: Privacy Department
        </p>
        <p>
          <em>(This is a template. Please consult with a legal professional to ensure your Privacy Policy is complete and compliant.)</em>
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
