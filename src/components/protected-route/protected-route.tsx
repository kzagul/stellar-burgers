import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, selectIsAuthChecked, selectUser } from '@store';
import { Preloader } from '../ui/preloader';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: JSX.Element;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
