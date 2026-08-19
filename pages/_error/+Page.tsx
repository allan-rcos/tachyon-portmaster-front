import { ErrorPage } from '@view/core/components/ErrorPage';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const forbidden = () => (pageContext as { abortStatusCode?: number }).abortStatusCode === 403;
  return (
    <ErrorPage
      forbidden={forbidden()}
      is404={pageContext.is404 ?? false}
      homeHref={toPageRequest(pageContext).href('/painel')}
    />
  );
}
