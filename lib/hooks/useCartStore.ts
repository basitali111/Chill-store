import { create } from 'zustand';
import { round2 } from '../utils';
import { OrderItem, ShippingAddress } from '../models/OrderModel';
import { persist } from 'zustand/middleware';

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  increase: (item: OrderItem) => void;
  decrease: (item: OrderItem) => void;
  addItem: (item: OrderItem) => void;
  saveShippingAddress: (shippingAddress: ShippingAddress) => void;
  savePaymentMethod: (paymentMethod: string) => void;
  clear: () => void;
  init: () => void;
};

const initialState: Omit<Cart, 'increase' | 'decrease' | 'addItem' | 'saveShippingAddress' | 'savePaymentMethod' | 'clear' | 'init'> = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    description: '',
  },
};

export const cartStore = create<Cart>()(
  persist(
    (set, get) => ({
      ...initialState,
      increase: (item: OrderItem) => {
        const { items } = get();
        const exist = items.find((x) => x.slug === item.slug && x.color === item.color && x.size === item.size);
        const updatedCartItems = exist
          ? items.map((x) =>
              x.slug === item.slug && x.color === item.color && x.size === item.size
                ? { ...exist, qty: exist.qty + 1 }
                : x
            )
          : [...items, { ...item, qty: 1 }];
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);
        set({
          items: updatedCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        });
      },
      decrease: (item: OrderItem) => {
        const { items } = get();
        const exist = items.find((x) => x.slug === item.slug && x.color === item.color && x.size === item.size);
        if (!exist) return;
        const updatedCartItems =
          exist.qty === 1
            ? items.filter((x: OrderItem) => x.slug !== item.slug || x.color !== item.color || x.size !== item.size)
            : items.map((x) =>
                x.slug === item.slug && x.color === item.color && x.size === item.size
                  ? { ...exist, qty: exist.qty - 1 }
                  : x
              );
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);
        set({
          items: updatedCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        });
      },
      addItem: (item: OrderItem) => {
        const { items } = get();
        const updatedCartItems = [...items, { ...item, qty: 1 }];
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);
        set({
          items: updatedCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        });
      },
      saveShippingAddress: (shippingAddress: ShippingAddress) => {
        set({
          shippingAddress,
        });
      },
      savePaymentMethod: (paymentMethod: string) => {
        set({
          paymentMethod,
        });
      },
      clear: () => {
        set({
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        });
      },
      init: () => set(initialState),
    }),
    {
      name: 'cartStore',
    }
  )
);

export default function useCartService() {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase,
    decrease,
    addItem,
    saveShippingAddress,
    savePaymentMethod,
    clear,
    init,
  } = cartStore();
  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase,
    decrease,
    addItem,
    saveShippingAddress,
    savePaymentMethod,
    clear,
    init,
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(Number(0.15 * itemsPrice)),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
