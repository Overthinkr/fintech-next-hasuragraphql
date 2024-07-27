import ReactDOM from 'react-dom/client'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, } from '@apollo/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './pages/landing.jsx';
import Account from './pages/account.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/account",
    element: <Account />
  }
]);


const client = new ApolloClient({
  uri: 'https://subspace-intern.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': import.meta.env.VITE_APP_HASURA_ADMIN_SECRET,
    'x-hasura-role': 'user',
    'x-hasura-user-id': 1
  },
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
