import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  useDispatch,
  useSelector,
  fetchUserOrders,
  selectUserOrders
} from '@store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
