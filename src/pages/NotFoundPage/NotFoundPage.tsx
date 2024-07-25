import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'components';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 32,
        padding: 16,
        fontSize: 32,
      }}
    >
      <span>404</span>
      <Button onClick={() => navigate('/', { replace: true })}>Return to main page</Button>
    </div>
  );
};
