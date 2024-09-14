import { ConvexAiChat } from "@/aiChat";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";

export type Conversation = {
  id: String,
  isLive: boolean,
  summary: string | null, 
  title: String | null, 
  dispatchConnected: boolean,
  EMSName: String | null,
  messages: Message[]
}

export type Message = {
  id: String,
  type: MessageAuthor,
  content: String
}

enum MessageAuthor {
  Caller = "caller",
  LLM = "llm"
}

function App() {

  const mockData: Conversation[] = [
    {
      id: "123",
      isLive: true,
      summary: null,
      title: null,
      dispatchConnected: false,
      EMSName: null,
      messages: [
        {
          id: "1",
          type: MessageAuthor.Caller,
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
      messages: [
        {
          id: "1",
          type: MessageAuthor.Caller,
          content: "My father is having chest pain, please hurry!"
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Is he conscious?"
        },
        {
          id: "3",
          type: MessageAuthor.Caller,
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
      messages: [
        {
          id: "1",
          type: MessageAuthor.Caller,
          content: "There's a car accident on Highway 7, multiple injuries."
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Emergency services are on the way. Can you provide details on the injuries?"
        },
        {
          id: "3",
          type: MessageAuthor.Caller,
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
      messages: [
        {
          id: "1",
          type: MessageAuthor.Caller,
          content: "My child is choking, I need help immediately!"
        },
        {
          id: "2",
          type: MessageAuthor.LLM,
          content: "Help is on the way. Please perform the Heimlich maneuver if you know how."
        },
        {
          id: "3",
          type: MessageAuthor.Caller,
          content: "I did it! They're breathing now, but they're still coughing."
        },
        {
          id: "4",
          type: MessageAuthor.LLM,
          content: "EMS will be there shortly. Keep them calm and monitor their breathing."
        }
      ]
    } as Conversation,
  ]

  return (
    <main className="container max-w-2xl flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold my-8 text-center">
        AI Chat with Convex Vector Search
      </h1>
      <p>Click the button to open the chat window</p>
      <p>
        <ConvexAiChat
          convexUrl={import.meta.env.VITE_CONVEX_URL as string}
          name="Lucky AI Bot"
          infoMessage="AI can make mistakes. Verify answers."
          welcomeMessage="Hey there, what can I help you with?"
          renderTrigger={(onClick) => (
            <Button onClick={onClick}>Open AI chat</Button>
          )}
        />
      </p>
      <p>
        Check out{" "}
        <Link target="_blank" href="https://docs.convex.dev/home">
          Convex docs
        </Link>
      </p>
    </main>
  );
}

export default App;
