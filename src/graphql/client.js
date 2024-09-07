import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://indexer.bigdevenergy.link/0ab6b43/v1/graphql',
  cache: new InMemoryCache(),
});

export default client;