/**
 * Reusable section title with optional Markdown paragraph.
 */
import type { Maybe } from 'graphql/jsutils/Maybe';
import ReactMarkdown from 'react-markdown';

const SectionTitle = ({
  title,
  paragraph,
  width = '570px',
  center,
  mb = '100px',
}: {
  /** Section heading text. */
  title: string;
  /** Optional Markdown paragraph below the title. */
  paragraph: Maybe<string>;
  /** Max width for the container. */
  width?: string;
  /** Center alignment toggle. */
  center?: boolean;
  /** Bottom margin. */
  mb?: string;
}) => {
  return (
    <div
      className={` w-full ${center ? 'mx-auto text-center' : ''}`}
      style={{ maxWidth: width, marginBottom: mb }}
    >
      <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
        {title}
      </h2>
      <div className="text-base !leading-relaxed text-body-color md:text-lg">
        <ReactMarkdown>{paragraph || ''}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SectionTitle;
