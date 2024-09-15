import { Conversation, Urgency } from "@/App";
import { Box, Button, Card, Flex, Heading, Table, Text } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from "react";

type Props = {
    conversation: Conversation,
    setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

function Call(props: Props) {
    const { conversation, setSelectedConversation } = props;

    return (
        <Flex justify="center" align="center">
          <Box>
            <Card size="5">
                <Heading align="left" mb="5px" weight="bold">{conversation.title ? conversation.title : "[New Call]"}</Heading>

                <Text size="5" weight="bold" mb="35px" as="div" style={{ color: 'white' }}>{conversation.isLive ? "Live" : "Resolved"}</Text>
                <Button style={{ backgroundColor: '#FFFFFF22' }} onClick={() => {setSelectedConversation(null)}}>Back</Button>

                <Box width="800px" mt="20px">
                    <Card>
                       <Box mt="20px">
                            {conversation.messages.map((message) => (
                                <Flex
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
                        </Box>
                    </Card>
                </Box>
            </Card>
          </Box>
        </Flex>
    );
}

export default Call;
