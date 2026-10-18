import {
  InformationCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Drawer from '@/components/Common/Drawer';
import { formatPrice } from '@/components/Common/Price';

type PropTypes = {
  open: boolean;
  onClose: () => void;
  currencySymbol: string | null | undefined;
};

export default function Cart({ open, onClose, currencySymbol }: PropTypes) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      closeLabel="Close bag"
      title={
        <>
          Bag <span className="text-muted tabular-nums">(0)</span>
        </>
      }
      footer={
        <>
          <div className="flex justify-between text-md font-bold">
            <p>Subtotal</p>
            <p className="tabular-nums">
              {formatPrice(currencySymbol ?? '', 0)}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted">
            Shipping and taxes calculated at checkout.
          </p>
          <button
            type="button"
            className="btn-primary mt-5 w-full"
            aria-disabled="true"
          >
            Checkout
          </button>
        </>
      }
    >
      <div className="flex gap-3 rounded-nav bg-cream p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-forest-2">
          <InformationCircleIcon
            aria-hidden="true"
            className="size-4.5 stroke-[2.2]"
          />
        </span>
        <div>
          <p className="text-base font-bold">This is a DatoCMS Demo</p>
          <p className="mt-1 text-sm text-pretty text-muted">
            To use the cart and enable purchases, an integration with Shopify or
            Commerce Layer is necessary.
          </p>
        </div>
      </div>

      {/* Centred in the free space, so the sheet doesn't end on a void */}
      <div className="my-auto flex flex-col items-center py-10 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-oat">
          <ShoppingBagIcon
            aria-hidden="true"
            className="size-7.5 stroke-[1.9]"
          />
        </span>
        <p className="title-md mt-6">Your bag is empty</p>
        <p className="mt-2 max-w-[28ch] text-base text-pretty text-muted">
          Pieces you add to your bag will appear here.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary btn-sm mt-6 h-12 px-6"
        >
          Continue shopping
        </button>
      </div>
    </Drawer>
  );
}
