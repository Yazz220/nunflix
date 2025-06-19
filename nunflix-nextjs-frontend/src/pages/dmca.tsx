import type { NextPage } from 'next';
import Head from 'next/head';

const DMCAPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>DMCA - Nunflix</title>
        <meta name="description" content="DMCA Policy for Nunflix" />
      </Head>
      <main style={{ padding: '20px', lineHeight: '1.6' }}>
        <h1>DMCA Takedown Request Policy</h1>
        <p>
          Nunflix respects the intellectual property rights of others and expects its users to do the same.
          In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously
          to notices of alleged copyright infringement that are reported to Nunflix's Designated Copyright Agent.
        </p>
        <h2>Filing a DMCA Notice</h2>
        <p>
          If you are a copyright owner or an agent thereof, and you believe that any content hosted on our
          services infringes your copyrights, then you may submit a notification pursuant to the DMCA
          by providing our Designated Copyright Agent with the following information in writing:
        </p>
        <ul>
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
          <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit Nunflix to locate the material.</li>
          <li>Information reasonably sufficient to permit Nunflix to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
          <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
        </ul>
        <h2>Designated Copyright Agent</h2>
        <p>
          Nunflix's Designated Copyright Agent to receive notifications of claimed infringement can be reached as follows:
        </p>
        <p>
          Copyright Agent<br />
          Nunflix Legal Department<br />
          [Your Company Address Here - e.g., 123 Streaming Ave, Entertainment City, CA 90210]<br />
          Email: copyright@nunflix.example.com (Please use a real email for a live site)
        </p>
        <p>
          Please note that this contact information is solely for DMCA notices. Any other inquiries will not receive a response through this process.
        </p>
        <h2>Counter-Notification</h2>
        <p>
          If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner’s agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to the Copyright Agent:
        </p>
        {/* Add counter-notification details if needed */}
        <p>
          <em>(This is a template. Please consult with a legal professional to ensure your DMCA policy is complete and compliant.)</em>
        </p>
      </main>
    </div>
  );
};

export default DMCAPage;
