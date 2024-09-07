// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// 0x233C9256A80732B734F6924A03fBB10Eb3a7Cf13
contract EventManagement {
    struct Event {
        string name;
        uint256 startTime;
        uint256 endTime;
        string location;
        string description;
        address creator;
        uint256 capacity;
        uint256 signUpFee;
        mapping(address => bool) participants;
        address[] participantList;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event EventCreated(uint256 eventId, string name, address creator);
    event ParticipantJoined(uint256 eventId, address participant);
    function createEvent(
        string memory _name,
        uint256 _startTime,
        uint256 _endTime,
        string memory _location,
        string memory _description,
        uint256 _capacity,
        uint256 _signUpFee
    ) public returns (uint256) {
        require(_startTime < _endTime, "Invalid event time range");
        require(_startTime > block.timestamp, "Event cannot start in the past");
        
        eventCount++;
        uint256 newEventId = eventCount;
        
        Event storage newEvent = events[newEventId];
        newEvent.name = _name;
        newEvent.startTime = _startTime;
        newEvent.endTime = _endTime;
        newEvent.location = _location;
        newEvent.description = _description;
        newEvent.creator = msg.sender;
        newEvent.capacity = _capacity;
        newEvent.signUpFee = _signUpFee;

        emit EventCreated(newEventId, _name, msg.sender);
        
        return newEventId;
    }

    function joinEvent(uint256 _eventId) public payable {
        Event storage event_ = events[_eventId];
        require(event_.startTime > block.timestamp, "Event has already started");
        require(event_.participantList.length < event_.capacity, "Event is full");
        require(!event_.participants[msg.sender], "Already joined");
        require(msg.value >= event_.signUpFee, "Insufficient sign-up fee");

        event_.participants[msg.sender] = true;
        event_.participantList.push(msg.sender);
        
        emit ParticipantJoined(_eventId, msg.sender);

        // Return excess payment
        if (msg.value > event_.signUpFee) {
            payable(msg.sender).transfer(msg.value - event_.signUpFee);
        }
    }

    function getParticipants(uint256 _eventId) public view returns (address[] memory) {
        require(msg.sender == events[_eventId].creator, "Only creator can view participants");
        return events[_eventId].participantList;
    }

    function withdrawFees(uint256 _eventId) public {
        Event storage event_ = events[_eventId];
        require(msg.sender == event_.creator, "Only creator can withdraw fees");
        require(event_.endTime < block.timestamp, "Event has not ended yet");

        uint256 totalFees = event_.participantList.length * event_.signUpFee;
        payable(event_.creator).transfer(totalFees);
    }
}