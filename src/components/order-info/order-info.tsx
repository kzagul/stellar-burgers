import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import {
  useSelector,
  selectIngredients,
  selectFeedOrders,
  selectUserOrders
} from '@store';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const [localOrder, setLocalOrder] = useState<TOrder | null>(null);

  const orderData =
    feedOrders.find((o) => o.number === Number(number)) ||
    userOrders.find((o) => o.number === Number(number)) ||
    localOrder;

  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number)).then((data) => {
        if (data.orders?.length) {
          setLocalOrder(data.orders[0]);
        }
      });
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
