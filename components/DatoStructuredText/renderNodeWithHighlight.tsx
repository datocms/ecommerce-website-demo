import { markRenderer } from './markRenderer';

// Default renderNode: pads the highlight mark so the marker wraps cleanly across lines
export const renderNodeWithHighlight = markRenderer((key, children) => (
  <mark key={key} className="-mx-0.5 box-decoration-clone px-0.5">
    {children}
  </mark>
));
