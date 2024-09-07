import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query MyQuery {
    EventManagement_EventCreated {
      id
      eventId
      creator
      name
    }
  }
`;