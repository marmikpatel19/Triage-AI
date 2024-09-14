import { ConvexAiChat } from "@/aiChat";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Avatar, Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Pie } from 'react-chartjs-2';

export type Conversation = {
  id: String,
  isLive: boolean,
  summary: string | null, 
  title: String | null, 
  dispatchConnected: boolean,
  EMSName: String | null,
  urgency: Urgency | null,
  messages: Message[]
}

export type Message = {
  id: String,
  type: MessageAuthor,
  content: String
}

enum MessageAuthor {
  CALLER = "caller",
  LLM = "llm"
}

enum Urgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH= "high"
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {

  const mockData: Conversation[] = [
    {
      id: "123",
      isLive: true,
      summary: null,
      title: null,
      dispatchConnected: false,
      EMSName: null,
      urgency: Urgency.HIGH,
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
      id: "456",
      isLive: true,
      summary: null,
      title: null,
      dispatchConnected: true,
      EMSName: "EMS Team 7",
      urgency: Urgency.HIGH,
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
      summary: "Accident on Highway 7",
      title: "Resolved",
      dispatchConnected: true,
      EMSName: "EMS Team 3",
      urgency: Urgency.MEDIUM,
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
      title: "Resolved",
      dispatchConnected: true,
      EMSName: "EMS Team 2",
      urgency: Urgency.HIGH,
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
      title: "Resolved",
      dispatchConnected: true,
      EMSName: "EMS Team 1",
      urgency: Urgency.LOW,
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
        data: [10, 20, 30, 10], // Example data, replace with your actual data
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#FFFFFF'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#FFFFFF'],
      },
    ],
  };

  const triageAIData = {
    datasets: [
      {
        label: '# of Calls',
        data: [15, 35], // Example data, replace with your actual data
        backgroundColor: ['#FF9F40', '#4BC0C0'],
        hoverBackgroundColor: ['#FF9F40', '#4BC0C0'],
      },
    ],
  };

  return (
    <Flex justify="center" justify-text="left" align="center" style={{ height: '100vh' }}>
      <Box maxWidth="1000px">
        <Card size="5">
          <Heading align="left">Triage AI</Heading>

          <Flex gap="3">
            <Box width="200px" height="100px">
              <Card>
                <Text size="9">8</Text>
                <Text size="5" weight="bold">Live Calls</Text>
              </Card>
            </Box>
            <Box width="200px" height="100px">
              <Card>
                <Pie data={data} />
                <Text size="5" weight="bold">Urgency Distribution</Text>
              </Card>
            </Box>
            <Box width="200px" height="100px">
              <Card>
                <Pie data={triageAIData} />
                <Text size="5" weight="bold">Outcome Distribution</Text>
              </Card>
            </Box>
          </Flex>

          {/* Content goes here */}
        </Card>
      </Box>
    </Flex>

    // <main className="container max-w-2xl flex flex-col gap-8">
    //   <h1 className="text-4xl font-extrabold my-8 text-center">
    //     Triage AI
    //   </h1>

    //   <Box maxWidth="240px">
    //     <Card>
    //       <Flex gap="3" align="center">
    //         <Avatar
    //           size="3"
    //           src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
    //           radius="full"
    //           fallback="T"
    //         />
    //         <Box>
    //           <Text as="div" size="2" weight="bold">
    //             Teodros Girmay
    //           </Text>
    //           <Text as="div" size="2" color="gray">
    //             Engineering
    //           </Text>
    //         </Box>
    //       </Flex>
    //     </Card>
    //   </Box>


    //   {/* <p>Click the button to open the chat window</p>
    //   <p>
    //     <ConvexAiChat
    //       convexUrl={import.meta.env.VITE_CONVEX_URL as string}
    //       name="Lucky AI Bot"
    //       infoMessage="AI can make mistakes. Verify answers."
    //       welcomeMessage="Hey there, what can I help you with?"
    //       renderTrigger={(onClick) => (
    //         <Button onClick={onClick}>Open AI chat</Button>
    //       )}
    //     />
    //   </p>
    //   <p>
    //     Check out{" "}
    //     <Link target="_blank" href="https://docs.convex.dev/home">
    //       Convex docs
    //     </Link>
    //   </p> */}
    // // </main>
  );
}

export default App;
