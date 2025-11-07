import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as reactQueryDevtools from '@tanstack/react-query-devtools';
import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlaceHolder';


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfinitePostsJsonPlaceholder />
      {import.meta.env.DEV && <reactQueryDevtools.ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;

