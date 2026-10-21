import { cloneElement, type ReactElement } from 'react';
import {
  type CdaStructuredTextRecord,
  StructuredText,
  type StructuredTextPropTypes,
} from 'react-datocms/structured-text';
import renderNodeWithHighlight from './renderNodeWithHighlight';

function addBoundaryAttribute(
  result: ReactElement | null,
): ReactElement | null {
  if (!result) return null;
  return cloneElement(result, {
    'data-datocms-content-link-boundary': true,
  } as Record<string, unknown>);
}

export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(
  props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord> & {
    /** Classes for the wrapper div */
    className?: string;
  },
) {
  const {
    renderBlock,
    renderInlineRecord,
    renderLinkToRecord,
    renderNode,
    className,
    ...rest
  } = props;

  return (
    <div data-datocms-content-link-group className={className}>
      <StructuredText
        {...rest}
        renderNode={renderNode ?? renderNodeWithHighlight}
        renderBlock={
          renderBlock
            ? (ctx) => addBoundaryAttribute(renderBlock(ctx))
            : undefined
        }
        renderInlineRecord={
          renderInlineRecord
            ? (ctx) => addBoundaryAttribute(renderInlineRecord(ctx))
            : undefined
        }
        renderLinkToRecord={renderLinkToRecord}
      />
    </div>
  );
}
