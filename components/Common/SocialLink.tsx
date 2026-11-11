import { stripStega } from '@datocms/content-link/stega';
import SvgRenderer from './SvgRenderer';

type Props = {
  social: { url: string; name?: string | null; icon: { url: string } };
};

// A CMS social link as an icon button; stripStega keeps draft-mode stega out of its accessible
// name
export default function SocialLink({ social }: Props) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={stripStega(social.name ?? '') || stripStega(social.url)}
      className="icon-btn"
    >
      <SvgRenderer url={social.icon.url} />
    </a>
  );
}
