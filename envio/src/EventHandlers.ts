/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  EventManagement,
  EventManagement_EventCreated,
  EventManagement_ParticipantJoined,
} from "generated";

EventManagement.EventCreated.handler(async ({ event, context }) => {
  const entity: EventManagement_EventCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    eventId: event.params.eventId,
    name: event.params.name,
    creator: event.params.creator,
  };

  context.EventManagement_EventCreated.set(entity);
});


EventManagement.ParticipantJoined.handler(async ({ event, context }) => {
  const entity: EventManagement_ParticipantJoined = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    eventId: event.params.eventId,
    participant: event.params.participant,
  };

  context.EventManagement_ParticipantJoined.set(entity);
});

