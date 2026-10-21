import {
  type ComponentProps,
  type FormEvent,
  useId,
  useRef,
  useState,
} from 'react';

export const TOKEN_FORM_ID = 'draft-auth';

/** What Headless UI's <Transition> hands its child: ref and data-closed/-enter/-leave */
type TransitionChildProps = Omit<
  ComponentProps<'form'>,
  'onSubmit' | 'children'
>;

type Props = {
  onClose: () => void;
  onSuccess: () => void;
} & TransitionChildProps;

export default function TokenForm({
  onClose,
  onSuccess,
  ...transitionProps
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  function showError() {
    setInputValue('');
    setHasError(true);
    inputRef.current?.focus();
  }

  async function enableDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isFetching) return;
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/draft/enable?token=${encodeURIComponent(inputValue)}`,
      );
      if (response.status === 200) {
        onSuccess();
        return;
      }
      showError();
    } catch {
      showError();
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <form
      // Headless UI's <Transition> hands the form its ref and data-closed/-enter/-leave
      // (pop in global.css)
      {...transitionProps}
      id={TOKEN_FORM_ID}
      aria-labelledby={`${id}-title`}
      onSubmit={enableDraft}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className="pop absolute right-0 bottom-full mb-3 w-[min(100vw-2*var(--gutter),25rem)] origin-bottom-right border border-ink bg-white p-5 sm:p-6"
    >
      <h2 id={`${id}-title`} className="title-item">
        Authenticate first
      </h2>
      <p className="mt-2 text-sm text-pretty text-ink-2">
        You will need a secret token to access the drafts. Please add it below.
      </p>
      <label
        htmlFor={`${id}-token`}
        className="mt-5 block text-sm font-semibold"
      >
        Secret token
      </label>
      <input
        ref={inputRef}
        id={`${id}-token`}
        type="password"
        autoComplete="off"
        // biome-ignore lint/a11y/noAutofocus: the popover opens on demand, so focus moves into it
        autoFocus
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setHasError(false);
        }}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className="input-field mt-2"
      />
      <div role="alert">
        {hasError && (
          <p
            id={`${id}-error`}
            className="quick enter mt-2 text-sm font-semibold text-sale"
          >
            That token doesn't match.
          </p>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={onClose} className="btn-line btn-sm">
          Cancel
        </button>
        <button type="submit" disabled={isFetching} className="btn btn-sm">
          {isFetching ? 'Checking…' : 'Authenticate'}
        </button>
      </div>
    </form>
  );
}
