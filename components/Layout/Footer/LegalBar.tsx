import type { Query as LayoutQuery } from '@/app/[lng]/(site)/meta';
import LanguageSelector from '@/components/Layout/LanguageSelector';

type GeneralInterface = LayoutQuery['generalInterface'];

type Props = {
  copyrightText: string | null | undefined;
  locales: LayoutQuery['_site']['locales'];
  currencySymbol: NonNullable<GeneralInterface>['currencySymbol'] | undefined;
  currencySymbols:
    | NonNullable<GeneralInterface>['_allCurrencySymbolLocales']
    | undefined;
  languageLabel: string | undefined;
};

// --draft-toggle-w is published by DraftModeToggle
const CLEAR_OF_DRAFT_TOGGLE =
  'max(var(--gutter), calc(var(--draft-toggle-w, 0px) + min(var(--draft-toggle-w, 0px), 1.5rem) + var(--gutter) - max(0px, (100vw - 90rem) / 2)))';

export default function LegalBar({
  copyrightText,
  locales,
  currencySymbol,
  currencySymbols,
  languageLabel,
}: Props) {
  return (
    // 80px tall from md, so the fixed draft toggle (48px, bottom-4) rests centred in it; the
    // right padding keeps the content clear of it
    <div className="border-t border-line">
      <div
        className="shell flex flex-col items-start gap-1 pt-5 pb-4.5 text-xs text-mute md:min-h-20 md:flex-row md:items-center md:justify-between md:gap-6 md:py-3"
        style={{ paddingRight: CLEAR_OF_DRAFT_TOGGLE }}
      >
        <p className="text-balance tabular-nums">{copyrightText}</p>
        <LanguageSelector
          languages={locales}
          currencySymbol={currencySymbol}
          currencySymbols={currencySymbols}
          label={languageLabel}
          placement="above-start-md-end"
          chevron
          className="-mx-2.5 min-h-11 px-2.5 text-ink-2 hover:text-white aria-expanded:text-white [&>svg:first-child]:size-4"
        />
      </div>
    </div>
  );
}
