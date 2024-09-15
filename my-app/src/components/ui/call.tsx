import { useEffect, useRef } from "react";
import { Conversation, Urgency } from "@/App";
import { Box, Button, Card, Flex, Heading, Text, Separator } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from "react";

type Props = {
    conversation: Conversation,
    setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

function Call(props: Props) {
    const { conversation, setSelectedConversation } = props;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation.messages]);

    return (
        <Flex justify="center" align="center">
            <Box>
                <Card size="5">
                    <Heading align="left" mb="5px" weight="bold">{conversation.title ? conversation.title : "[New Call]"}</Heading>
                    <Text size="5" weight="bold" mb="35px" as="div" style={{ color: '#03DAC6' }}>
                        {conversation.isLive ? "Live" : "Resolved"}
                    </Text>
                    <Button style={{ backgroundColor: '#FFFFFF22' }} onClick={() => { setSelectedConversation(null) }}>Back</Button>

                    <Box width="800px" mt="20px">
                        <Card>
                            <Box
                                mt="20px"
                                style={{
                                    height: "400px", // Adjust height as needed
                                    overflowY: "auto",
                                    paddingRight: "10px" // Adjusts for scrollbar width
                                }}
                            >
                                {conversation.messages.map((message, index) => (
                                    <Flex
                                        key={index}
                                        justify={message.type === "caller" ? "start" : "end"}
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
                                            <Text size="3" as="div">{message.content}</Text>
                                        </Card>
                                    </Flex>
                                ))}
                                <div ref={messagesEndRef} />
                            </Box>
                        </Card>

                        <Separator my="20px" />

                        <Card mb="10px">
                            <Flex justify="center" >
                                <Box>
                                    <Text size="4" weight="bold" as="div" >
                                        {conversation.summary ? conversation.summary : "No summary yet"}
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
                                        {conversation.dispatchConnected && `Dispatch Connected: ${conversation.dispatchConnected}`}
                                    </Text>
                                </Flex>
                            </Card>
                        </Flex>
                        <Flex justify="center" width="100%" gap="20px">
                            <Card mb="10px">
                                <Flex justify="center">
                                    <Text size="4" as="div" mr="20px">
                                        {conversation.EMSName && `EMS Name: ${conversation.EMSName}`}
                                    </Text>
                                </Flex>
                            </Card>
                            <Card mb="10px" >
                                <Flex justify="center">
                                    <Text size="4" as="div">
                                        {conversation.medicalEmergencyType && `Emergency Type: ${conversation.medicalEmergencyType}`}
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

export default Call;
