import {
  InformationCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Drawer from '@/components/Common/Drawer';
import { formatPrice } from '@/lib/formatPrice';

type Props = {
  open: boolean;
  onClose: () => void;
  currencySymbol: string | null | undefined;
};

export default function Cart({ open, onClose, currencySymbol }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      closeLabel="Close bag"
      title={
        <>
          Bag <span className="font-normal text-mute tabular-nums">(0)</span>
        </>
      }
      footer={
        <>
          <div className="flex justify-between text-md font-semibold">
            <p>Subtotal</p>
            <p className="tabular-nums">
              {formatPrice(currencySymbol ?? '', 0)}
            </p>
          </div>
          <p className="mt-1 text-sm text-mute">
            Shipping and taxes calculated at checkout.
          </p>
          <button
            type="button"
            className="btn mt-5 w-full"
            aria-disabled="true"
          >
            Checkout
          </button>
        </>
      }
    >
      <div className="flex gap-3 bg-mist p-4">
        <InformationCircleIcon
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0"
        />
        <div>
          <p className="text-base font-semibold">This is a DatoCMS Demo</p>
          <p className="mt-1 text-sm text-pretty text-ink-2">
            To use the cart and enable purchases, an integration with Shopify or
            Commerce Layer is necessary.
          </p>
        </div>
      </div>

      {/* Centred in the free space, so the sheet doesn't end on a void */}
      <div className="my-auto flex flex-col items-center py-12 text-center">
        <span className="grid size-20 place-items-center bg-mist">
          <ShoppingBagIcon aria-hidden="true" className="size-7" />
        </span>
        <p className="title-card mt-6">Your bag is empty</p>
        <p className="mt-2 max-w-[28ch] text-sm text-pretty text-mute">
          Pieces you add to your bag will appear here.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-line btn-sm mt-7"
        >
          Continue shopping
        </button>
      </div>
    </Drawer>
  );
}
