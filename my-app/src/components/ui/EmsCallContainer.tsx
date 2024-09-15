import { Conversation, Urgency } from "@/App";
import { Avatar, Box, Card, Flex, Heading, Table, Text } from '@radix-ui/themes';
import chestPainLogo from './chest_pain_logo.png';
import breathingDifficultyLogo from './breathing_difficulty_logo.png';
import fallInjuryLogo from './fall_injury_logo.png';
import seizureLogo from './seizure_logo.png';
import strokeSymptomsLogo from './stroke_symptoms_logo.png';
import undecidedLogo from './undecided_logo.png';

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

enum MedicalEmergencyType {
    CHEST_PAIN = "chest pain",
    BREATHING_DIFFICULTY = "breathing difficulty",
    FALL_INJURY = "fall injury",
    SEIZURE = "seizure",
    STROKE_SYMPTOMS = "stroke symptoms",
    UNDECIDED = "undecided"
  }

const logoMap: Record<MedicalEmergencyType, string> = {
    [MedicalEmergencyType.CHEST_PAIN]: chestPainLogo,
    [MedicalEmergencyType.BREATHING_DIFFICULTY]: breathingDifficultyLogo,
    [MedicalEmergencyType.FALL_INJURY]: fallInjuryLogo,
    [MedicalEmergencyType.SEIZURE]: seizureLogo,
    [MedicalEmergencyType.STROKE_SYMPTOMS]: strokeSymptomsLogo,
    [MedicalEmergencyType.UNDECIDED]: undecidedLogo,
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
                                className={`${getRowColor(conversation.urgency)} rounded-md mb-2`}
                            >
                                <Table.RowHeaderCell>
                                    {conversation.medicalEmergencyType && 
                                        (<Avatar src={logoMap[conversation.medicalEmergencyType]} fallback={undecidedLogo} size="2" className="rounded-full" />
                                    )}                                       
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
