import { Conversation, pieStats, Urgency } from "@/App";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Pie } from "react-chartjs-2";
import { Dispatch, SetStateAction } from "react";

type Props = {
  userData: Conversation[];
  callUrgencies: pieStats;
  callOutcomes: pieStats;
};

function StatsContainer(props: Props) {
  const { userData, callUrgencies, callOutcomes } = props;

  return (
    <Box width="30vw" mt="20px">
      <Flex gap="7" align="center" mb="140px">
        <Box width="175px" height="130px">
          <Card>
            <Flex direction="column">
              <Box>
                <Text size="9" weight="bold" mb="10px" ml="40px">
                  {
                    userData.filter((conversation) => conversation.isLive)
                      .length
                  }
                </Text>
              </Box>
              <Text size="5" weight="bold" align="center">
                Live Calls
              </Text>
            </Flex>
          </Card>
        </Box>
        <Box width="175px" height="130px">
          <Card>
            <Pie data={callUrgencies} />
            <Text size="5" weight="bold">
              Call Urgency
            </Text>
          </Card>
        </Box>
        <Box width="175px" height="130px">
          <Card>
            <Pie data={callOutcomes} />
            <Text size="5" weight="bold">
                Call Outcome
            </Text>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}

export default StatsContainer;
