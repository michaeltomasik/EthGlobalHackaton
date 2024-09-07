import assert from "assert";
import { 
  TestHelpers,
  EventManagement_EventCreated
} from "generated";
const { MockDb, EventManagement } = TestHelpers;

describe("EventManagement contract EventCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for EventManagement contract EventCreated event
  const event = EventManagement.EventCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("EventManagement_EventCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await EventManagement.EventCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualEventManagementEventCreated = mockDbUpdated.entities.EventManagement_EventCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedEventManagementEventCreated: EventManagement_EventCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      eventId: event.params.eventId,
      name: event.params.name,
      creator: event.params.creator,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventManagementEventCreated, expectedEventManagementEventCreated, "Actual EventManagementEventCreated should be the same as the expectedEventManagementEventCreated");
  });
});
