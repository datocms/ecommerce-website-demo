import type { Query as LayoutQuery } from '@/app/[lng]/(site)/meta';
import OptionalLink from '@/components/Common/OptionalLink';
import { linkHref } from '@/lib/datocms/linkHref';

type Props = {
  lng: string;
  columns: NonNullable<LayoutQuery['layout']>['footerColumns'];
};

export default function FooterColumns({ lng, columns }: Props) {
  return (
    // From md, 1fr tracks never shrink below their longest word, so a German compound
    // stays whole
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[repeat(4,1fr)] lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6">
      {columns.map((column) => (
        <div key={column.id} className="min-w-0 md:min-w-auto">
          <h2 className="eyebrow hyphens-auto wrap-break-word">
            {column.label}
          </h2>
          <ul className="mt-3.5 space-y-2.5">
            {column.footerItem.map((item) => (
              <li key={item.id}>
                <OptionalLink
                  href={linkHref(lng, item)}
                  className="text-sm hyphens-auto wrap-break-word text-mute transition-colors duration-150 hover:text-white md:hyphens-manual"
                >
                  {item.label}
                </OptionalLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
