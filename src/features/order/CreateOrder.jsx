// import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import EmptyCart from '../cart/EmptyCart';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  // const [withPriority, setWithPriority] = useState(false);
  // const cart = fakeCart;

  const cart = useSelector((state) => state.cart.cart); // can't use my cart because of id and pizzaId

  const username = useSelector((state) => state.user.username);

  if (!cart.length) {
    return <EmptyCart />;
  }

  console.log('mycart', cart);

  return (
    <div className='px-4 py-6'>
      <h2 className='text-xl font-semibold mb-8'>Make your order!</h2>

      {/* <Form method='POST' action='/order/new'> */}
      <Form method='POST'>
        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:item-center'>
          <label className='sm:basis-40'>First Name</label>
          <input
            defaultValue={username}
            className='input grow'
            type='text'
            name='customer'
            required
          />
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:item-center'>
          <label className='sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input type='tel' name='phone' required className='input w-full' />
            {formErrors?.phone && (
              <p className='text-xs mt-2 text-red-700'>{formErrors.phone}</p>
            )}
          </div>
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:item-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              type='text'
              name='address'
              required
              className='input w-full'
            />
          </div>
        </div>

        <div className='mb-12 flex items-center gap-5'>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            className='h-6 w-6 accent-stone-400
            focus:outline-none focus:ring focus:ring-offset-2'
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority' className='font-medium'>
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type='small'>
            {isSubmitting ? 'Ordering...' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// action
export async function createOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // console.log('formData', formData);
  console.log('Data', data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  // console.log('order', order);

  const errors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone = 'The phone number is not correct.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  // if averything is ok, create new order and redirect
  const newOrder = await createOrder(order);
  console.log('newOrder', newOrder);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
