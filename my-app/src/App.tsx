import { ConvexAiChat } from "@/aiChat";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import StatsContainer from "./components/ui/StatsContainer";
import { Pie } from "react-chartjs-2";
import EmsCallContainer from "./components/ui/EmsCallContainer";
import Header from "./components/Header";
import UserDashboard from "./components/ui/UserDashboard";

export type Conversation = {
  id: String;
  isLive: boolean;
  summary: string | null;
  title: String | null;
  dispatchConnected: boolean;
  EMSName: String | null;
  urgency: Urgency | null;
  medicalEmergencyType: MedicalEmergencyType | null;
  messages: Message[];
};

export type pieStats = {
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
};

export type Message = {
  id: String;
  type: MessageAuthor;
  content: String;
};

export enum MessageAuthor {
  CALLER = "caller",
  LLM = "llm",
}

export enum Urgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  UNDECIDED = "undecided",
}

export enum MedicalEmergencyType {
  CHEST_PAIN = "chest pain",
  BREATHING_DIFFICULTY = "breathing difficulty",
  FALL_INJURY = "fall injury",
  SEIZURE = "seizure",
  STROKE_SYMPTOMS = "stroke symptoms",
  UNDECIDED = "undecided",
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";
import Call from "./components/ui/call";
import colors from "./colors";
import LiveTranscription from "./components/ui/LiveTranscription";

// Register necessary elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

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
          content: "Hello, I need help! There's been an accident.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Please stay calm. Can you tell me your location?",
        },
      ],
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
          content: "Hello, I need help! There's been an accident.",
        },
        {
          id: "22",
          type: MessageAuthor.LLM,
          content: "Please stay calm. Can you tell me your location?",
        },
      ],
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
          content: "My father is having chest pain, please hurry!",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Is he conscious?",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Yes, but he's in a lot of pain.",
        },
      ],
    } as Conversation,
    {
      id: "789",
      isLive: false,
      summary: "Accident on Highway 7, multiple injuries",
      title: "Car accident on Highway 7, multiple injuries, outer",
      dispatchConnected: true,
      EMSName: "EMS Team 3",
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.FALL_INJURY,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "There's a car accident on Highway 7, multiple injuries.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content:
            "Emergency services are on the way. Can you provide details on the injuries?",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Two people are unconscious, and one has a broken leg.",
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content: "Stay with them. Emergency services should arrive shortly.",
        },
      ],
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
          content: "My child is choking, I need help immediately!",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content:
            "Help is on the way. Please perform the Heimlich maneuver if you know how.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content:
            "I did it! They're breathing now, but they're still coughing.",
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content:
            "EMS will be there shortly. Keep them calm and monitor their breathing.",
        },
      ],
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
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
    {
      id: "1011",
      isLive: false,
      summary: "Medical emergency - Resolved",
      title: "Exposure to cyanide, concentration unknwown",
      dispatchConnected: true,
      EMSName: "EMS Team 2",
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.SEIZURE,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "My child is choking, I need help immediately!",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content:
            "Help is on the way. Please perform the Heimlich maneuver if you know how.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content:
            "I did it! They're breathing now, but they're still coughing.",
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content:
            "EMS will be there shortly. Keep them calm and monitor their breathing.",
        },
      ],
    } as Conversation,
    {
      id: "1213",
      isLive: false,
      summary: "Minor accident",
      title: "back pain, regular pain",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.HIGH,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
    {
      id: "1011",
      isLive: false,
      summary: "Medical emergency - Resolved",
      title: "Minimal dialouge, poison control suspected",
      dispatchConnected: true,
      EMSName: "EMS Team 2",
      urgency: Urgency.MEDIUM,
      medicalEmergencyType: MedicalEmergencyType.SEIZURE,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "My child is choking, I need help immediately!",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content:
            "Help is on the way. Please perform the Heimlich maneuver if you know how.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content:
            "I did it! They're breathing now, but they're still coughing.",
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content:
            "EMS will be there shortly. Keep them calm and monitor their breathing.",
        },
      ],
    } as Conversation,
    {
      id: "1213",
      isLive: false,
      summary: "Minor accident",
      title: "Arm injusy on west boston",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.LOW,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
    {
      id: "1214",
      isLive: false,
      summary: "Medical emergency - Resolved",
      title: "biking accident, head damage",
      dispatchConnected: true,
      EMSName: "EMS Team 2",
      urgency: Urgency.MEDIUM,
      medicalEmergencyType: MedicalEmergencyType.SEIZURE,
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "My child is choking, I need help immediately!",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content:
            "Help is on the way. Please perform the Heimlich maneuver if you know how.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content:
            "I did it! They're breathing now, but they're still coughing.",
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content:
            "EMS will be there shortly. Keep them calm and monitor their breathing.",
        },
      ],
    } as Conversation,
    {
      id: "1215",
      isLive: false,
      summary: "Minor accident",
      title: "eldery fell down the stairs--east Boston",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.MEDIUM,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
    {
      id: "1215",
      isLive: false,
      summary: "Minor accident",
      title: "ankle injury",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.LOW,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
    {
      id: "1215",
      isLive: false,
      summary: "Minor accident",
      title: "internal bleeding; ems connected",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.UNDECIDED,
      medicalEmergencyType: MedicalEmergencyType.UNDECIDED, // Default to UNDECIDED
      messages: [
        {
          id: "1",
          type: MessageAuthor.CALLER,
          content: "I slipped on the stairs, and I think I sprained my ankle.",
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Try to keep the ankle elevated.",
        },
        {
          id: "3",
          type: MessageAuthor.CALLER,
          content: "Okay, I'm doing that now. Thank you.",
        },
      ],
    } as Conversation,
  ];

  const data = {
    datasets: [
      {
        label: "# of Tasks",
        data: [10, 20, 30, 10],
        backgroundColor: ["#03DAC6", "#BB86FC", "#CF6679", "#3700B3"],
        hoverBackgroundColor: ["#03DAC6", "#BB86FC", "#CF6679", "#3700B3"],
      },
    ],
  };

  const triageAIData = {
    datasets: [
      {
        label: "# of Calls",
        data: [15, 35],
        backgroundColor: ["#03DAC6", "#BB86FC"],
        hoverBackgroundColor: ["#03DAC6", "#BB86FC"],
      },
    ],
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedConversation(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Header title="triage.ai" /> {/* Add the Header component here */}
      {selectedConversation ? (
        <Flex justify="start" align="center" direction="row" gap="20px">
          <Flex justify="start" align="center">
            <Box>
              <Card size="5">
                <EmsCallContainer
                  title="Live EMS Calls"
                  conversations={mockData.filter(
                    (conversation) => conversation.isLive
                  )}
                  setSelectedConversation={setSelectedConversation}
                />
              </Card>
            </Box>
          </Flex>
          <LiveTranscription
            setSelectedConversation={setSelectedConversation}
          />
        </Flex>
      ) : (
        <Flex gap="2vw" height="150vh">
          <Card size="4">
            <EmsCallContainer
              title="Resolved EMS Calls"
              conversations={mockData.filter(
                (conversation) => !conversation.isLive
              )}
              setSelectedConversation={setSelectedConversation}
            />
          </Card>
          <UserDashboard
            userName="John"
            stats={{
              finished: 18,
              finishedTasks: 8,
              tracked: 31,
              trackedHoursChange: "-6",
              efficiency: 93,
              efficiencyChange: "+12%",
            }}
            tasks={[
              {
                name: "Product Review for UI8 Market",
                status: "In Progress",
                time: "4h",
                progress: 30,
              },
              {
                name: "UX Research for Product",
                status: "On Hold",
                time: "8h",
                progress: 60,
              },
              {
                name: "App design and development",
                status: "Done",
                time: "32h",
                progress: 100,
              },
            ]}
            setSelectedConversation={setSelectedConversation}
            mockData={mockData}
          />
        </Flex>
      )}
    </>
  );
}

export default App;
