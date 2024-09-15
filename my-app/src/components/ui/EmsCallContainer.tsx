import { ConvexAiChat } from "@/aiChat";
import { Conversation, Urgency } from "@/App";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Avatar, Box, Card, Flex, Heading, Table, Text } from '@radix-ui/themes';
import { Pie } from 'react-chartjs-2';

type Props = {
    title: string,
    conversations: Conversation[]
}

const getRowColor = (urgency: Urgency | null) => {
    switch (urgency) {
        case Urgency.LOW:
            return 'bg-green-100 rounded-lg'; 
        case Urgency.MEDIUM:
            return 'bg-yellow-100 rounded-lg'; 
        case Urgency.HIGH:
            return 'bg-red-100 rounded-lg'; 
        case Urgency.UNDECIDED:
            return 'bg-gray-50 rounded-lg'; 
        default:
            return 'rounded-lg';
    }
};

function EmsCallContainer(props: Props) {
    const {title, conversations} = props;

    

    return (
        <Box width="800px" mt="20px">
            <Card>
                <Text size="5" weight="bold" mb="20px" as="div">{title}</Text>
                <Table.Root>
                    <Table.Body>
                        {conversations.map((conversation) => (
                            <Table.Row>
                            <Box 
                                className={`${getRowColor(conversation.urgency)} rounded-sm mb-2`}
                            >
                                <Table.RowHeaderCell>
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
