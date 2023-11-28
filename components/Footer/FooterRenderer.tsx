import Image from 'next/image';
import Link from 'next/link';
import SvgRenderer from '../Common/SvgRenderer';
import {
  FooterQuery,
  LegalPageRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { primaryColor } from '@/app/i18n/settings';
import ReactMarkdown from 'react-markdown';

type Props = {
  data: FooterQuery;
  lng: SiteLocale;
};

const Footer = ({ data, lng }: Props) => {
  return (
    <footer className="bg-white pt-4 sm:pt-6 lg:pt-8 max-w-7xl mx-auto">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-t py-6 md:flex-row">
        <div className="mb-3 text-center md:mb-0 md:text-left">
          <span className="font-bold uppercase tracking-widest text-gray-800">Newsletter</span>
          <p className="text-gray-500">Subscribe to our newsletter</p>
        </div>
  
        <form className="flex w-full gap-2 md:max-w-md">
          <input placeholder="Email" className="w-full flex-1 rounded border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-500 outline-none ring-indigo-300 transition duration-100 focus:ring" />
  
          <button className="inline-block rounded bg-primary px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-primary/80 focus-visible:ring active:bg-indigo-700 md:text-base">Send</button>
        </form>
      </div>
    </div>
  
    <div className="pt-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
          <div className="col-span-full lg:col-span-2">

            <div className="mb-4 lg:-mt-2">
              <a href="/" className="inline-flex items-center gap-2 text-xl font-bold text-black md:text-2xl" aria-label="logo">
                <svg width="95" height="94" viewBox="0 0 95 94" className="h-auto w-5 text-primary" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M96 0V47L48 94H0V47L48 0H96Z" />
                </svg>
  
                Flowrift
              </a>
            </div>

  
            <p className="mb-6 text-gray-500 sm:pr-8">Filler text is dummy text which has no meaning however looks very similar to real text</p>
  

            <div className="flex gap-4">
              <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
  
              <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
  
              <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
  
              <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

          </div>
  

          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Products</div>
  
            <nav className="flex flex-col gap-4">
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Overview</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Solutions</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Pricing</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Customers</a>
              </div>
            </nav>
          </div>

  

          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Company</div>
  
            <nav className="flex flex-col gap-4">
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">About</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Investor Relations</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Jobs</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Press</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Blog</a>
              </div>
            </nav>
          </div>

  

          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Support</div>
  
            <nav className="flex flex-col gap-4">
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Contact</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Documentation</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Chat</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">FAQ</a>
              </div>
            </nav>
          </div>

  

          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Legal</div>
  
            <nav className="flex flex-col gap-4">
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Terms of Service</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Privacy Policy</a>
              </div>
  
              <div>
                <a href="#" className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80">Cookie settings</a>
              </div>
            </nav>
          </div>

        </div>
  
        <div className="border-t py-8 text-center text-sm text-gray-400">© 2021 - Present Flowrift. All rights reserved.</div>
      </div>
    </div>
  </footer>
    // <footer className="relative z-10 mx-auto flex w-full flex-col items-center justify-center bg-primary bg-opacity-5 pt-16 text-center md:text-start lg:pt-24">
    //   <div className="container w-full">
    //     <div className="flex w-full flex-col justify-between md:flex-row md:px-16">
    //       <div className="w-full">
    //         <div className="mx- mb-12 lg:mb-16">
    //           <Link href={'/' + lng + '/home'} className="mb-8 inline-block">
    //             {data.layout?.footerLogo && (
    //               <Image
    //                 src={data.layout.footerLogo.url}
    //                 alt="logo"
    //                 className="w-full"
    //                 width={data.layout.footerLogo.width || 100}
    //                 height={data.layout.footerLogo.height || 100}
    //               />
    //             )}
    //           </Link>
    //           <div className="mb-9 text-base font-medium leading-relaxed text-body-color">
    //             <ReactMarkdown>
    //               {data.layout!.footerSubtitle || ''}
    //             </ReactMarkdown>
    //           </div>
    //           <div className="flex items-center justify-center md:justify-start">
    //             {data.layout!.socialMediaLinks.map((socialMedia) => {
    //               return (
    //                 <a
    //                   href={socialMedia.url}
    //                   aria-label="social-link"
    //                   className="mr-6 text-[#CED3F6] hover:text-primary"
    //                   key={socialMedia.id}
    //                 >
    //                   <SvgRenderer url={socialMedia.icon.url} />
    //                 </a>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="flex w-full md:text-end">
    //         <div className="w-full">
    //           <div className="mb-12 lg:mb-16">
    //             <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
    //               Legal
    //             </h2>
    //             <ul>
    //               {data.layout!.footerLinks.map((link) => {
    //                 const pageLink = link as LegalPageRecord; // The field has a "at least one" validation
    //                 return (
    //                   <li key={pageLink.id}>
    //                     <a
    //                       href={'/' + lng + '/legal/' + pageLink.slug}
    //                       className="mb-4 inline-block text-base font-medium text-body-color hover:text-primary"
    //                     >
    //                       {' '}
    //                       {pageLink.title}{' '}
    //                     </a>
    //                   </li>
    //                 );
    //               })}
    //             </ul>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="absolute right-0 top-14 z-[-1]">
    //     <svg
    //       width="55"
    //       height="99"
    //       viewBox="0 0 55 99"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
    //       <mask
    //         id="mask0_94:899"
    //         style={{ maskType: 'alpha' }}
    //         maskUnits="userSpaceOnUse"
    //         x="0"
    //         y="0"
    //         width="99"
    //         height="99"
    //       >
    //         <circle
    //           opacity="0.8"
    //           cx="49.5"
    //           cy="49.5"
    //           r="49.5"
    //           fill={primaryColor}
    //         />
    //       </mask>
    //       <g mask="url(#mask0_94:899)">
    //         <circle
    //           opacity="0.8"
    //           cx="49.5"
    //           cy="49.5"
    //           r="49.5"
    //           fill={primaryColor}
    //         />
    //         <g opacity="0.8" filter="url(#filter0_f_94:899)">
    //           <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
    //         </g>
    //       </g>
    //       <defs>
    //         <filter
    //           id="filter0_f_94:899"
    //           x="12.4852"
    //           y="-15.1763"
    //           width="82.7646"
    //           height="82.7646"
    //           filterUnits="userSpaceOnUse"
    //           colorInterpolationFilters="sRGB"
    //         >
    //           <feFlood floodOpacity="0" result="BackgroundImageFix" />
    //           <feBlend
    //             mode="normal"
    //             in="SourceGraphic"
    //             in2="BackgroundImageFix"
    //             result="shape"
    //           />
    //           <feGaussianBlur
    //             stdDeviation="10.5"
    //             result="effect1_foregroundBlur_94:899"
    //           />
    //         </filter>
    //         <radialGradient
    //           id="paint0_radial_94:899"
    //           cx="0"
    //           cy="0"
    //           r="1"
    //           gradientUnits="userSpaceOnUse"
    //           gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
    //         >
    //           <stop stopOpacity="0.47" />
    //           <stop offset="1" stopOpacity="0" />
    //         </radialGradient>
    //       </defs>
    //     </svg>
    //   </div>
    //   <div className="absolute bottom-24 left-0 z-[-1]">
    //     <svg
    //       width="79"
    //       height="94"
    //       viewBox="0 0 79 94"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <rect
    //         opacity="0.3"
    //         x="-41"
    //         y="26.9426"
    //         width="66.6675"
    //         height="66.6675"
    //         transform="rotate(-22.9007 -41 26.9426)"
    //         fill="url(#paint0_linear_94:889)"
    //       />
    //       <rect
    //         x="-41"
    //         y="26.9426"
    //         width="66.6675"
    //         height="66.6675"
    //         transform="rotate(-22.9007 -41 26.9426)"
    //         stroke="url(#paint1_linear_94:889)"
    //         strokeWidth="0.7"
    //       />
    //       <path
    //         opacity="0.3"
    //         d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
    //         fill="url(#paint2_linear_94:889)"
    //       />
    //       <path
    //         d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
    //         stroke="url(#paint3_linear_94:889)"
    //         strokeWidth="0.7"
    //       />
    //       <path
    //         opacity="0.3"
    //         d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
    //         fill="url(#paint4_linear_94:889)"
    //       />
    //       <path
    //         d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
    //         stroke="url(#paint5_linear_94:889)"
    //         strokeWidth="0.7"
    //       />
    //       <defs>
    //         <linearGradient
    //           id="paint0_linear_94:889"
    //           x1="-41"
    //           y1="21.8445"
    //           x2="36.9671"
    //           y2="59.8878"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0.62" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
    //         </linearGradient>
    //         <linearGradient
    //           id="paint1_linear_94:889"
    //           x1="25.6675"
    //           y1="95.9631"
    //           x2="-42.9608"
    //           y2="20.668"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0.51" />
    //         </linearGradient>
    //         <linearGradient
    //           id="paint2_linear_94:889"
    //           x1="20.325"
    //           y1="-3.98039"
    //           x2="90.6248"
    //           y2="25.1062"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0.62" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
    //         </linearGradient>
    //         <linearGradient
    //           id="paint3_linear_94:889"
    //           x1="18.3642"
    //           y1="-1.59742"
    //           x2="113.9"
    //           y2="80.6826"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0.51" />
    //         </linearGradient>
    //         <linearGradient
    //           id="paint4_linear_94:889"
    //           x1="61.1098"
    //           y1="62.3249"
    //           x2="-8.82468"
    //           y2="58.2156"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0.62" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
    //         </linearGradient>
    //         <linearGradient
    //           id="paint5_linear_94:889"
    //           x1="65.4236"
    //           y1="65.0701"
    //           x2="24.0178"
    //           y2="41.6598"
    //           gradientUnits="userSpaceOnUse"
    //         >
    //           <stop stopColor={primaryColor} stopOpacity="0" />
    //           <stop offset="1" stopColor={primaryColor} stopOpacity="0.51" />
    //         </linearGradient>
    //       </defs>
    //     </svg>
    //   </div>
    // </footer>
  );
};

export default Footer;
