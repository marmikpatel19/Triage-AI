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
  console.log(conversation?.messages);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]); // Ensure this effect runs when messages are updated

  // If conversation isn't loaded yet, show a loading state
  if (!conversation) return <Text>Loading...</Text>;

  return (
    <Flex justify="end" align="center">
      <Box>
        <Card size="5">
          <Heading align="left" mb="5px" weight="bold">
            {`${
              conversation[0] ? conversation[0].messageContent : "[New Call]"
            }`}
          </Heading>
          <Text
            size="5"
            weight="bold"
            mb="35px"
            as="div"
            style={{ color: "#03DAC6" }}
          >
            {"Live"}
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
                {conversation?.length > 0 ? (
                  conversation.map((message, index) => (
                    <Flex
                      key={index}
                      justify={
                        message.messageUser === "caller" ? "start" : "end"
                      } // Using messageUser to align
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
                          {message.messageContent || "No content"}{" "}
                          {/* Show message content */}
                        </Text>
                      </Card>
                    </Flex>
                  ))
                ) : (
                  <Text>No messages available</Text>
                )}
                <div ref={messagesEndRef} />
              </Box>
            </Card>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
}

export default LiveTranscription;
