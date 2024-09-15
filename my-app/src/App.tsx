import { ConvexAiChat } from "@/aiChat";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Avatar, Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Pie } from 'react-chartjs-2';
import EmsCallContainer from "./components/ui/EmsCallContainer";

export type Conversation = {
  id: String,
  isLive: boolean,
  summary: string | null, 
  title: String | null, 
  dispatchConnected: boolean,
  EMSName: String | null,
  urgency: Urgency | null,
  medicalEmergencyType: MedicalEmergencyType | null,
  messages: Message[]
}

export type Message = {
  id: String,
  type: MessageAuthor,
  content: String
}

export enum MessageAuthor {
  CALLER = "caller",
  LLM = "llm"
}

export enum Urgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH= "high",
  UNDECIDED="undecided"
}

export enum MedicalEmergencyType {
  CHEST_PAIN = "chest pain",
  BREATHING_DIFFICULTY = "breathing difficulty",
  FALL_INJURY = "fall injury",
  SEIZURE = "seizure",
  STROKE_SYMPTOMS = "stroke symptoms",
  UNDECIDED = "undecided"
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from "react";

// Register necessary elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const mockData: Conversation[] = [
    {
      id: "123",
      isLive: true,
      summary: null,
      title: null,
      dispatchConnected: false,
      EMSName: null,
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.CHEST_PAIN,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "Hello, I need help! There's been an accident."
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Please stay calm. Can you tell me your location?"
        }
      ]
    } as Conversation,
    {
      id: "1232",
      isLive: true,
      summary: null,
      title: null,
      dispatchConnected: false,
      EMSName: null,
      urgency: Urgency.UNDECIDED,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "14",
          type: MessageAuthor.CALLER,
          content: "Hello, I need help! There's been an accident."
        },
        {
          id: "22",
          type: MessageAuthor.LLM,
          content: "Please stay calm. Can you tell me your location?"
        }
      ]
    } as Conversation,
    {
      id: "456",
      isLive: true,
      summary: null,
      title: "Chest pain; elderly",
      dispatchConnected: true,
      EMSName: "EMS Team 7",
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.CHEST_PAIN,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "My father is having chest pain, please hurry!"
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Is he conscious?"
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Yes, but he's in a lot of pain."
        }
      ]
    } as Conversation,
    {
      id: "789",
      isLive: false,
      summary: "Accident on Highway 7, multiple injuries",
      title: "Car accident ",
      dispatchConnected: true,
      EMSName: "EMS Team 3",
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.FALL_INJURY,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "There's a car accident on Highway 7, multiple injuries."
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Emergency services are on the way. Can you provide details on the injuries?"
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Two people are unconscious, and one has a broken leg."
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content: "Stay with them. Emergency services should arrive shortly."
        }
      ]
    } as Conversation,
    {
      id: "1011",
      isLive: false,
      summary: "Medical emergency - Resolved",
      title: "Choking child",
      dispatchConnected: true,
      EMSName: "EMS Team 2",
      urgency: Urgency.MEDIUM,
      medicalEmergencyType: MedicalEmergencyType.SEIZURE,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "My child is choking, I need help immediately!"
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Please perform the Heimlich maneuver if you know how."
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "I did it! They're breathing now, but they're still coughing."
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content: "EMS will be there shortly. Keep them calm and monitor their breathing."
        }
      ]
    } as Conversation,
    {
      id: "1213",
      isLive: false,
      summary: "Minor accident",
      title: "Slipped on the stairs; minor injury",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.LOW,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle."
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated."
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you."
        }
      ]
    } as Conversation,
  ]

  const data = {
    datasets: [
      {
        label: '# of Tasks',
        data: [10, 20, 30, 10], 
        backgroundColor: ['#03DAC6', '#BB86FC', '#CF6679', '#3700B3'], 
        hoverBackgroundColor: ['#03DAC6', '#BB86FC', '#CF6679', '#3700B3'], 
      },
    ],
  };

  const triageAIData = {
    datasets: [
      {
        label: '# of Calls',
        data: [15, 35], 
        backgroundColor: ['#03DAC6', '#BB86FC'],
        hoverBackgroundColor: ['#03DAC6', '#BB86FC'],
      },
    ],
  };

  return (
    <>
      {selectedConversation ? (
        <></> 
      ) : (
        <Flex justify="center" align="center">
          <Box>
            <Card size="5">
              <Heading align="left" mb="30px">Triage AI</Heading>

              <Flex gap="7" align="center" mb="140px">
                <Box width="175px" height="130px">
                  <Card>
                    <Flex direction="column">
                      <Box>
                        <Text size="9" weight="bold" mb="10px" ml="40px">
                          {mockData.filter((conversation) => conversation.isLive).length}
                        </Text>
                      </Box>
                      <Text size="5" weight="bold" align="center">
                        Live Calls
                      </Text>
                    </Flex>
                  </Card>
                </Box>
                <Box width="175px" height="130px">  
                  <Card>
                    <Pie data={data} />
                    <Text size="5" weight="bold">Urgency Distribution</Text>
                  </Card>
                </Box>
                <Box width="175px" height="130px">
                  <Card>
                    <Pie data={triageAIData} />
                    <Text size="5" weight="bold">Outcome Distribution</Text>
                  </Card>
                </Box>
              </Flex>

              <EmsCallContainer 
                title="Live EMS Calls" 
                conversations={mockData.filter((conversation) => conversation.isLive)} 
                setSelectedConversation={setSelectedConversation} 
              />
              <EmsCallContainer 
                title="Resolved EMS Calls" 
                conversations={mockData.filter((conversation) => !conversation.isLive)} 
                setSelectedConversation={setSelectedConversation} 
              />
            </Card>
          </Box>
        </Flex>
      )}
    </>
  );
}

export default App;