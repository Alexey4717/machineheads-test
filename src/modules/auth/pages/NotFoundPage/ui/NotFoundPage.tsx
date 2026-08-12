import { Page } from '@/core/ui/Page/Page';

const NotFoundPage = () => {
  return (
    <Page
      title="Страница не найдена"
      error={{
        status: 404,
        title: '404',
        subtitle: 'Страница не найдена',
      }}
    />
  );
};

export default NotFoundPage;
