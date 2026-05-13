import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('\nFATAL ERROR: DATABASE_URL is not loaded from .env file.');
    process.exit(1);
  }
  if (!username || !password) {
    console.error('\nFATAL ERROR: ADMIN_USERNAME and ADMIN_PASSWORD must be set in your .env file.');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  console.log('Successfully loaded environment variables.');
  const hashedPassword = await hash(password, 12);
  const existingAdmin = await prisma.user.findUnique({ where: { username } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: { username, password_hash: hashedPassword, role: 'admin' },
    });
    console.log(`Admin user '${username}' created successfully.`);
  } else {
    console.log(`Admin user '${username}' already exists. Seeding skipped.`);
  }

  // ─── SiteConfig seed ───────────────────────────────────────────────

  const siteConfigs = [

    // ── Footer ─────────────────────────────────────────────────────────
    {
      key: 'footer',
      data: {
        description:
          "A strategic subsidiary of Meidensha Corporation, Japan. Delivering world-class power transmission and distribution technology to India's industrial core since 2008.",
        columns: [
          {
            title: 'Company',
            links: [
              { label: 'About Us',             href: '/about-us',         external: false },
              { label: 'Products & Solutions', href: '/products',         external: false },
              { label: 'Quality Policy',       href: '/quality-policy',   external: false },
              { label: 'Careers',              href: 'https://meidensha.zohorecruit.in/jobs/Careers', external: true },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacy Policy', href: '/privacy-policy', external: false },
              { label: 'Terms of Use',   href: '/terms',          external: false },
            ],
          },
        ],
        headquarters: {
          address: 'Building No. 10, Tower C, 1st Floor, DLF Cyber City, Phase - II, Gurgaon-122002, India',
          phone: '+91-124-4549830',
          email: 'info@meiden.in',
        },
        bottomBar: {
          copyrightName: 'Meiden T&D (India) Ltd.',
          globalSiteLabel: 'Meidensha Global',
          globalSiteUrl: 'https://www.meidensha.com/',
        },
      },
    },

    // ── Social Links ────────────────────────────────────────────────────
    {
      key: 'social_links',
      data: {
        linkedin:  'https://www.linkedin.com/company/meiden-t-d-india-limited/',
        twitter:   '',
        facebook:  '',
        youtube:   '',
      },
    },

    // ── Contact Us ─────────────────────────────────────────────────────
    {
      key: 'contact_us',
      data: {
        hero: {
          badgeText: 'Live Support System',
          heading: 'Get in Touch',
          subheading:
            "Connect with our specialized <strong>Sales</strong> and <strong>Procurement</strong> teams.",
        },
        headquarters: {
          address: 'Building No. 10, Tower C, 1st Floor,\nDLF Cyber City, Phase - II,\nGurgaon-122002, India',
          mapUrl: 'https://maps.app.goo.gl/of8fxmSnCmqyG2ua8',
        },
        contactPanel: {
          heading: 'Start a Conversation',
          subheading:
            'Requires technical specifications or wish to register as a supplier? Our digital desk is ready.',
          phone: '+91-124-4549830',
          email: 'info@meiden.in',
          location: 'Gurgaon, India',
        },
        termsModal: {
          heading: 'Terms of Use & Privacy',
          subheading: 'Meiden T&D India Limited',
          complianceNotice:
            'By proceeding, you adhere to our corporate data governance policies.',
          sections: [
            {
              title: '1. Scope of Data Collection',
              body: 'We collect professional information solely for the purpose of business correspondence, inquiry resolution, and technical support.',
            },
            {
              title: '2. Data Usage',
              body: 'Internal auditing and compliance checks.\nRouting technical queries to the relevant engineering divisions.\nData is strictly confidential and not shared with external third parties without consent.',
            },
            {
              title: '3. User Responsibility',
              body: 'Please ensure that any technical documents or drawings uploaded do not contain restricted or classified third-party intellectual property unless authorized.',
            },
          ],
        },
      },
    },

    // ── Privacy Policy ─────────────────────────────────────────────────
    {
      key: 'privacy_policy',
      data: {
        title: 'Privacy Policy',
        lastUpdated: '2025-01-01',
        sections: [
          {
            heading: '1. Basic Policy',
            subsections: [
              {
                title: null,
                body: "Meiden T&D India limited (\"we/us/our\") understands that properly handling and managing information which could identify specific individuals (\"Personal Data\") is socially expected and an important responsibility of a company as it aims to engage in fair and good faith corporate activities, as well as being necessary in order for a company to strictly comply with the Act on the Protection of Personal Information. Therefore, in an effort to strengthen the relationship of trust between us and society as a whole, and in an effort to fulfill its social obligations, we promulgates this privacy policy (\"Privacy Policy\"), and will handle Personal Data in accordance with this Privacy Policy.",
              },
              {
                title: '(1) Acquisition of Personal Data',
                body: "When you visit our website, our web servers automatically record the IP address of your Internet service provider, the website from which you visit us, the pages on our website you visit and the date and duration of your visit. This information is absolutely necessary for the technical transmission of the web pages and the secure server operation. A personalized evaluation of this data does not take place.\n\nIf you send us data via contact form, this data will be stored on our servers in the course of data backup. Your data will only be used by us to process your request. Your data will be treated strictly confidential. Your data will not be passed on to third parties.",
              },
              {
                title: '(2) Management of Personal Data',
                body: 'Personal data is data about your person. This includes your name, address and email address. You also do not need to provide any personal information to visit our website. In some cases we need your name and address as well as further information to be able to offer you the desired service.\n\nThe same applies in the event that we supply you with information material on request or when we answer your enquiries. In these cases we will always point this out to you. In addition, we only store data that you have transmitted to us automatically or voluntarily.',
              },
              {
                title: '(3) Utilization of Personal Data',
                body: 'When acquiring Personal Data, we will clarify the intended purpose of the utilization of the information, and use the information only to the extent necessary for achieving this purpose and performing our business.',
              },
              {
                title: '(4) Provision of Personal Data',
                body: 'We will not disclose or provide Personal Data to any third parties except in the following cases:\n1. When the affected person has given prior consent to the disclosure of his/her Personal Data\n2. When disclosure of such Personal Data is necessary to protect human life, safety, or property, but where it is difficult to obtain permission from the affected person\n3. When complying with laws and regulations\n4. When entrusting the handling of Personal Data to a third party to the extent necessary to achieve the purpose\n5. When sharing Personal Data with our group companies, sales agents, or other companies where necessary\n6. When another entity succeeds to our business due to a merger, corporate separation, or transfer of business',
              },
              {
                title: '(5) Response to Requests Relating to Personal Data',
                body: 'We will respond promptly and in accordance with relevant laws and regulations to requests relating to Personal Data, including requests for the disclosure, correction, addition, deletion, cessation of use, or purge of Personal Data.',
              },
              {
                title: '(6) Implementation, Improvement and Revision of the Privacy Policy',
                body: 'In order to strictly comply with the Act on the Protection of Personal Information and related ordinances, guidelines set out by the government, and other relevant rules and regulations, and to implement the Privacy Policy, we will establish internal rules and regulations, etc., in addition to the Privacy Policy, and will ensure that all our employees and other persons concerned recognize the importance of such rules and regulations and comply with them.',
              },
              {
                title: '(7) Inquiries Concerning Personal Data',
                body: 'MEIDEN T&D (INDIA) LIMITED\nBuilding No. 10. Tower C, 1st Floor, DLF Cyber City,\nPhase - II, Gurgaon-122002, Haryana, India\nTelephone: +91-124-4549830',
                isContactBlock: true,
              },
            ],
          },
          {
            heading: '2. Personal Data Regarding Our Website Users',
            subsections: [
              {
                title: '(1) Acquisition of Personal Data',
                body: 'The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:\n- Date and time of the request\n- Page from which the file was requested\n- Access status (file transferred, file not found, etc.)\n- Web browser and operating system used\n- Complete IP address of the requesting computer\n- Transferred data volume\n\nThese data will not be merged with other data sources. Processing takes place in accordance with legitimate interest in improving the stability and functionality of our website.',
              },
              {
                title: '(2) Utilization of Personal Data',
                body: 'Personal Data offered by you will be utilized by us within the scope of the stated purpose of the utilization with which you have agreed.',
              },
              {
                title: '(3) Utilization of Cookie',
                body: 'When you visit our website, we may store information on your computer in the form of cookies. Cookies are small files that are transferred from an Internet server to your browser and stored on its hard drive. Only the Internet protocol address is stored here - no personal data.',
              },
              {
                title: '(4) Utilization of Google Tag Manager',
                body: 'This website uses Google Tag Manager. The Tag Manager does not collect personally identifiable information. The tool triggers other tags that may themselves collect information. You can learn more at: https://www.google.com/analytics/terms/tag-manager/',
              },
              {
                title: '(5) Utilization of Google Analytics',
                body: 'We use Google Analytics, a web analysis service provided by Google LLC. Google Analytics uses "cookies", which are text files placed on your computer, to help the website analyze how users use the site. The information generated by these cookies is transmitted to Google and stored there.\n\nYou may refuse the use of cookies by selecting the appropriate settings on your browser. Google offers a deactivation add-on for the most common browsers. For further information, please visit: https://tools.google.com/dlpage/gaoptout?hl=en-GB',
              },
              {
                title: '(6) Utilization of SPIRAL',
                body: 'We use the SPIRAL online database service provided by PIPED BITS Co., Ltd. as an entry form.',
              },
              {
                title: '(7) Safety Measures Protecting Personal Data',
                body: 'We have taken technical and administrative security precautions to protect your personal data against loss, destruction, manipulation and unauthorized access. All our employees as well as service providers working for us are obliged to comply with the applicable data protection laws.',
              },
              {
                title: '(8) Observance of Laws, Ordinances and Other Rules',
                body: 'In regard to the Personal Data provided by you through this web site, we will comply with the relevant laws and ordinances, as well as other rules that are applicable in Japan.',
              },
              {
                title: '(9) Your Rights',
                body: 'You have the right at any time to information, correction, deletion or restriction of the processing of your stored data, a right of objection to the processing as well as a right to data transfer and a right of complaint in accordance with the requirements of data protection law.\n\nRight to Information: You can request information from us as to whether and to what extent we process your data.\nRight to Correction: If we process your data that is incomplete or incorrect, you can demand that we correct or complete it at any time.\nRight to Deletion: You can demand that we delete your data if we process it unlawfully or if the processing disproportionately interferes with your legitimate protection interests.\nRight to Limit Processing: You can ask us to restrict the processing of your data in certain circumstances.\nRight to Data Transferability: You may request that we provide you with the information you have provided to us in a structured, common and machine-readable format.\nRight of Objection: If we process your data out of legitimate interest, you may object to this data processing at any time.\nRight of Complaint: If you are of the opinion that we infringe data protection regulations, please contact us or the supervisory authority responsible for you.',
              },
              {
                title: '(10) Personal Data of the Linked Pages',
                body: 'Our website is linked to various other websites. However, we hereby declare that we are not responsible for the processing of personal data by such websites maintained by third parties.',
              },
              {
                title: '(11) Changes to this Privacy Policy',
                body: 'We reserve the right to change our privacy policy if necessary due to new technologies. Please make sure that you have the most updated version. If any essential changes are made to this privacy policy, we will notify those changes on our website.',
              },
            ],
          },
        ],
      },
    },

    // ── Terms of Use ───────────────────────────────────────────────────
    {
      key: 'terms',
      data: {
        title: 'Terms of Use',
        lastUpdated: '2025-01-01',
        introduction:
          'This website is managed by MEIDEN T&D (INDIA) LIMITED ("Company") or its agents for the primary purpose of offering information to our customers. When a customer utilizes this website, the Company will assume that the accessing customer has consented to the terms of use specified below ("Terms of Use"). If a person is unwilling to consent to the Terms of Use, such user is hereby requested to refrain from browsing this website or utilizing any services offered, such as any downloads offered on the website.\n\nThe Company may from time to time change or modify a part of or all of the terms and conditions of the Terms of Use. We request that each user or customer regularly review the Terms of Use for updates. Any such modification will take effect immediately at the time the modified Terms of Use are uploaded onto this website. The Company will assume that a customer or a user has agreed to such modified Terms of Use when a customer or a user accesses or views this website upon or after such modification takes effect. When there are any separate or special conditions for utilization in regard to specific services offered on this website, such separate or special conditions shall have priority.',
        sections: [
          {
            title: '1. Introduction to the Utilization of Our Website',
            body: "In accordance with the Terms of Use, the Company will grant to our customers the right to browse this website and to view the information available therein by way of allowing access to the same and displaying the relevant information on the data terminal of a personal computer or the like at the customer's end. However, the right granted to the customer herein shall be non-exclusive and non-transferable. The customer shall be regarded as having consented to not disrupt the management of this website in any way. If a customer violates the Terms of Use, the Company will withdraw the above-mentioned right from such customer. In such case, the customer concerned shall immediately dispose of all information acquired from this website.",
          },
          {
            title: '2. Copyright',
            body: "Unless otherwise specified, the Company reserves the copyright to all documents and other contents presented in this website. Each user shall be aware that any action such as duplication, modification, reprint, etc. of the contents included in the website without permission from the Company is prohibited pursuant to the Copyright Act. The Company will not grant a license to any customer of any of the Company's rights in regard to copyright, patents, trademarks, and other intellectual properties belonging to the Company.\n\nWhen there are separate or special conditions for utilization stipulated in a particular document, such separate or special conditions shall have priority.",
          },
          {
            title: '3. Provision of Information',
            body: 'The provision of confidential information by a customer or its agents through this website is prohibited. Any information provided by a customer to the Company through this website will be accepted under the assumption that the customer concerned has consented to the Company handling such information as non-confidential information.\n\nAny information provided by a customer or its agents to the Company through this website will be accepted under the assumption that the right to utilize such information has been given to the Company on a free of charge basis, which will be irrevocable and without any limitations. However, the personal information of each customer will be handled in accordance with the "Privacy Policy", to be promulgated separately.\n\nAny actions, including writing, that produces material which falls into any of the categories specified below shall be prohibited:\n1. Contents that could infringe the copyright or any other intellectual property belonging to the Company or a third party\n2. Contents that could defame, calumniate, or threaten the Company or a third party\n3. Contents that could be deemed to be the promotion of a business, advertisement, invitation, solicitation, etc.\n4. Contents contrary to public order and morals\n5. Contents that causes or could cause criminal acts or crimes\n6. Any other contents that could hinder the management of the website, as determined by the Company',
          },
          {
            title: '4. Disclaimer',
            body: "The Company pays utmost attention to the quality of the information displayed on this website, but the Company takes no responsibility in any way for the correctness, reliability, timeliness, usefulness, and fitness for a customer's purpose of such information, nor does the Company take responsibility for the safety and the functionality of this website itself. Unless otherwise specified in the specific terms and conditions for a particular service offered on this website, the Company takes no responsibility in any way for any damages accrued by the customer in relation to the customer's utilization of this website.",
          },
          {
            title: '5. Linkage',
            body: "The Company shall in no way be responsible for any damages accrued by the customer in relation to the customer's utilization of a website linked to the Company's website (\"Link Site\"), or the contents acquired through the Link Site. When a customer utilizes a Link Site, the customer shall be required to comply with the terms of use stipulated by such Link Site.\n\nThe presence of a link to a Link Site on this website does not imply the Company's utilization of such Link Site, nor does it imply any business relationship between the Company and the person or organization that manages the Link Site, or the merchandise or services, etc. displayed on the Link Site.",
          },
          {
            title: '6. Linkage With This Website',
            body: "When linking to this website via a website other than the Company's website, no particular statement to report that fact to the Company is required. However, the user will be deemed to understand and agree that the Company may demand the cancelation of the link to the Company's website when the Company determines such linkage to be undesirable.\n\nAny linkage from a website which falls into or could fall into any of the following categories will be rejected:\n1. Linkage from a website that defames or calumniates the Company, its associated companies, or a third party\n2. Linkage from a website that impairs the Company's credibility, reputation, or dignity, such as websites contrary to public order and morality\n3. Linkage from a website that contains illegal or possibly illegal contents, or is concerned with illegal or possibly illegal activities\n4. Linkage that may give rise to a misconception of any possible affiliated or cooperative relationship with the Company, or a misconception that the Company is acknowledging or supporting the website containing the original linkage\n\nThe Company shall not be responsible in any way for any complaints, claims, or other similar petitions from a customer or a third party related to a customer website that falls into any of the above categories.",
          },
          {
            title: '7. Utilization Outside India and Applicable Laws',
            body: 'This website is managed and controlled within the territory of India by the Company. The Company makes no declaration or representation in regard to whether activities such as acquiring information on this website or making access available to this website are permissible, legally valid, or possible in any other country or area outside of India. The establishment, effectiveness, enforceability, fulfilment, and interpretation of the Terms of Use will be governed by the laws of India. Should any necessity for any litigation arise in regard to this website between a customer and the Company, India Court shall have exclusive jurisdiction as the court of first instance.\n\nTrademarks of Other Companies:\n- Adobe and an Adobe logo are either registered trademarks or trademarks of Adobe Systems Incorporated in the United States and/or other countries.\n- Microsoft, Windows, Windows Vista, Aero, Excel, Outlook, PowerPoint, Windows Media, a Windows logo, a Windows start logo, and an Office logo are either registered trademarks or trademarks of Microsoft Corporation in the United States and/or other countries.\n\nIn addition, the corporate names or product names, etc. are either trade names, or trademarks or registered trademarks of the respective owners.',
          },
        ],
      },
    },

    // ── Home page ──────────────────────────────────────────────────────
    {
      key: 'home',
      data: {
        footerNote: 'Meiden T&D India Limited',
        copyright: 'Copyright © MEIDEN T&D (INDIA) LIMITED All rights reserved.',
        categories: [
          {
            label: 'Access',
            description: 'Location and contact information',
            image: '/images/home-category-1.jpg',
            href: 'https://www.google.com/maps/place/Building+10,+Tower+C/@28.493262,77.085909,17z',
            external: true,
          },
          {
            label: 'One MEIDEN',
            description: 'Global Meidensha network',
            image: '/images/home-category-2.gif',
            href: 'https://www.meidensha.com/onemeiden/',
            external: true,
          },
        ],
      },
    },

    // ── News Releases ──────────────────────────────────────────────────
    {
      key: 'news_releases',
      data: {
        items: [
          {
            id: 'nr-001',
            date: '2024-10-03',
            category: 'Information',
            year: '2024',
            title: "Meiden T&D receives a large-scale order for a part of Traction substation equipment to be used in India's Mumbai-Ahmedabad High Speed Rail Project.",
            published: true,
            detail: {
              type: 'pdf',
              // will be replaced with a Vercel Blob URL once migrated
              href: 'https://meidentd.in/images/news/dfd28e02bcfeceec4088f5766cf07724.pdf',
              label: 'View Document',
            },
          },
          {
            id: 'nr-002',
            date: '2024-06-11',
            category: 'Information',
            year: '2024',
            title: 'Meiden T&D receives certificate of appreciation for running its plant on Green Fuel.',
            published: true,
            detail: {
              type: 'image',
              // will be replaced with a Vercel Blob URL once migrated
              src: 'https://meidentd.in/images/news/8d69d72a95e182189233e6fb9c82e30d.jpeg',
              alt: 'Certificate of appreciation for Green Fuel',
            },
          },
          {
            id: 'nr-003',
            date: '2024-07-20',
            category: 'Information',
            year: '2024',
            title: 'Meiden T&D celebrates its Annual Day.',
            published: true,
            detail: {
              type: 'pdf',
              href: 'https://meidentd.in/images/news/6ec7640b69f23e00a1255017357241fe.pdf',
              label: 'View Document',
            },
          },
          {
            id: 'nr-004',
            date: '2024-04-24',
            category: 'Information',
            year: '2024',
            title: 'Notice of system maintenance.',
            published: true,
            detail: {
              type: 'maintenance',
              schedule: 'Sunday, February 25, 2024  06:30 – 12:30',
              notes: [
                'During the above period, there will be intermittent inability to access the website.',
                'The time may vary depending on the work progress.',
              ],
            },
          },
        ],
      },
    },
  ];

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: { key: config.key, data: config.data },
    });
    console.log(`SiteConfig '${config.key}' seeded.`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});