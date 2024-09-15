import { Conversation, Urgency } from "@/App";
import { Box, Card, Table, Text } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from "react";

type Props = {
    title: string,
    conversations: Conversation[],
    setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

const getUrgencyColor = (urgency: Urgency | null) => {
    switch (urgency) {
        case Urgency.LOW:
            return '#03DAC6'; 
        case Urgency.MEDIUM:
            return '#BB86FC'; 
        case Urgency.HIGH:
            return '#CF6679'; 
        case Urgency.UNDECIDED:
            return '#3700B3'; 
        default:
            return '#3700B3'; 
    }
};

function EmsCallContainer(props: Props) {
    const { title, conversations, setSelectedConversation } = props;

    return (
        <Box width="800px" mt="20px">
            <Card>
                <Text size="5" weight="bold" mb="20px" as="div" style={{ color: 'white' }}>{title}</Text>
                <Table.Root>
                    <Table.Body>
                        {conversations.map((conversation) => (
                            <Table.Row 
                                onClick={() => setSelectedConversation(conversation)}
                                style={{ cursor: 'pointer' }} 
                            >
                                <Box 
                                    className="rounded-md mb-2 flex items-center"
                                    style={{ color: '#BB86FC' }}
                                >
                                    <Table.RowHeaderCell style={{ color: 'white', fontWeight: '800' }}>
                                        <Box 
                                            style={{
                                                backgroundColor: getUrgencyColor(conversation.urgency),
                                                borderRadius: '50%',
                                                width: '11px',
                                                height: '11px',
                                                display: 'inline-block',
                                                marginRight: '8px'
                                            }}
                                        />
                                        {conversation.title || "[New Call]"}
                                    </Table.RowHeaderCell>
                                </Box>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Card>
        </Box>
    );
}

export default EmsCallContainer;
