import { useEffect, useRef } from "react";
import { Conversation } from "@/App";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Separator,
} from "@radix-ui/themes";
import { Dispatch, SetStateAction } from "react";
import { useQuery } from "convex/react"; // Assuming you're using the convex/react library
import { api } from "../../../convex/_generated/api"; // Adjust this import to your Convex API path

type Props = {
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>;
};

function LiveTranscription({ setSelectedConversation }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to the conversation's messages in Convex
  const conversation = useQuery(api.getMessages.listTasks) || [];
  console.log(conversation);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]); // Ensure this effect runs when messages are updated

  // If conversation isn't loaded yet, show a loading state
  if (!conversation) return <Text>Loading...</Text>;

  return (
    <Flex justify="end" align="center">
      <Box>
        <Card size="5">
          <Heading align="left" mb="5px" weight="bold">
            {conversation.title || "[New Call]"}
          </Heading>
          <Text
            size="5"
            weight="bold"
            mb="35px"
            as="div"
            style={{ color: "#03DAC6" }}
          >
            {conversation.isLive ? "Live" : "Resolved"}
          </Text>
          <Button
            style={{ backgroundColor: "#FFFFFF22" }}
            onClick={() => {
              setSelectedConversation(null);
            }}
          >
            Back
          </Button>

          <Box width="50vw" mt="20px">
            <Card>
              <Box
                mt="20px"
                style={{
                  height: "400px",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                {conversation.messages.map((message, index) => (
                  <Flex
                    key={index}
                    justify={message.messageUser === "caller" ? "start" : "end"} // Using messageUser to align
                    mb="10px"
                  >
                    <Card
                      style={{
                        maxWidth: "60%",
                        backgroundColor: "#FFFFFF09",
                        color: "white",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    >
                      <Text size="3" as="div">
                        {message.messageContent} {/* Show message content */}
                      </Text>
                    </Card>
                  </Flex>
                ))}
                <div ref={messagesEndRef} />
              </Box>
            </Card>

            <Separator my="20px" />

            <Card mb="10px">
              <Flex justify="center">
                <Box>
                  <Text size="4" weight="bold" as="div">
                    {conversation.summary || "No summary yet"}
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Flex justify="center" width="100%" gap="20px">
              <Card mb="10px">
                <Flex justify="center">
                  <Text size="4" as="div" mr="20px">
                    {conversation.urgency && `Urgency: ${conversation.urgency}`}
                  </Text>
                </Flex>
              </Card>
              <Card mb="10px">
                <Flex justify="center">
                  <Text size="4" as="div">
                    {conversation.dispatchConnected &&
                      `Dispatch Connected: ${conversation.dispatchConnected}`}
                  </Text>
                </Flex>
              </Card>
            </Flex>

            <Flex justify="center" width="100%" gap="20px">
              <Card mb="10px">
                <Flex justify="center">
                  <Text size="4" as="div" mr="20px">
                    {conversation.EMSName &&
                      `EMS Name: ${conversation.EMSName}`}
                  </Text>
                </Flex>
              </Card>
              <Card mb="10px">
                <Flex justify="center">
                  <Text size="4" as="div">
                    {conversation.medicalEmergencyType &&
                      `Emergency Type: ${conversation.medicalEmergencyType}`}
                  </Text>
                </Flex>
              </Card>
            </Flex>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
}

export default LiveTranscription;
