/* eslint-disable react-hooks/rules-of-hooks */
import { lazy, Suspense, useEffect, useState } from 'react';
import LoadingPage from '../../pages/commons/LoadingPage';

const LazyLoadComponent =
  (componentPath: any) =>
  (showLoader: boolean = true) =>
  (props?: JSX.IntrinsicAttributes) => {
    const [ComponentContainer, setComponentContainer] = useState<any>(null);

    useEffect(() => {
      const path = componentPath();
      setComponentContainer(lazy(() => path));
    }, []);

    return (
      <Suspense fallback={showLoader ? <LoadingPage /> : null}>
        {ComponentContainer && <ComponentContainer {...props} />}
      </Suspense>
    );
  };

export default LazyLoadComponent;
