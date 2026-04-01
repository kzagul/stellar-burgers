import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector, selectUser } from '@store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  return <AppHeaderUI userName={user?.name || ''} />;
};
