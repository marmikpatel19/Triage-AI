import { Box, Card, Text, Flex, Blockquote, Separator } from "@radix-ui/themes";
import { Conversation } from "@/App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmsCallContainer from "./EmsCallContainer";
import colors from "../../colors";
import { CiCalendar } from "react-icons/ci";
import * as SeparatorVer from '@radix-ui/react-separator';
import { FaRegThumbsUp } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";

// Props for the user data, stats, and tasks
type DashboardProps = {
  userName: string;
  stats: {
    finished: number;
    finishedTasks: number;
    tracked: number;
    trackedHoursChange: string;
    efficiency: number;
    efficiencyChange: string;
  };
  tasks: { name: string; status: string; time: string; progress: number }[];
  mockData: Conversation[];
  setSelectedConversation: React.Dispatch<React.SetStateAction<any>>;
};

function UserDashboard({
  userName,
  stats,
  tasks,
  mockData,
  setSelectedConversation,
}: DashboardProps) {
  // Dummy data for the line chart
  const data = [
    { date: "01", thisMonth: 7, lastMonth: 6 },
    { date: "02", thisMonth: 8, lastMonth: 6 },
    { date: "03", thisMonth: 6, lastMonth: 5 },
    { date: "04", thisMonth: 7, lastMonth: 6 },
    { date: "05", thisMonth: 9, lastMonth: 7 },
    { date: "06", thisMonth: 8, lastMonth: 6 },
    { date: "07", thisMonth: 7, lastMonth: 6 },
  ];

  return (
    <Box width="60vw" height="100vh">
      <Card style={{ display: "flex", flexDirection: "column" }}>
        {/* Greeting Section */}
        <Box mt="24px" mb="10px">
          <Flex justify="between">
            <Text weight="bold" style={{ color: "white", fontSize: "2.5rem" }}>
              Hello, {userName}.
            </Text>
            <Flex justify="end">
              <Text style={{ color: "white", fontSize: "1rem" , marginTop: "20px"}}>
                15 Aug, 2024
              </Text>
              <CiCalendar style={{ color: "white", fontSize: "1.5rem" , marginTop: "18px", marginLeft: "8px"}}/>
              </Flex>
          </Flex>
        </Box>
        <Blockquote color="violet">
          {" "}
          Get started by reviewing the active medical inquiries below.
        </Blockquote>

        <Separator orientation="horizontal" size="4" mt="20px" />
        {/* Stats Section */}
        <Flex justify="between" align="center" mb="20px" style={{ marginTop: "25px" }}>
          <Box style={{ display: 'flex', alignItems: 'center', marginLeft: "50px"}}>
            <FaRegThumbsUp style={{ fontSize: "1.4rem", marginRight: "10px"}} />
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="5" weight="bold" style={{ color: "white" }}>
                Finished
              </Text>
              <Text size="4" style={{ color: "#BB86FC" }}>
                {stats.finished} <span>+{stats.finishedTasks} tasks</span>
              </Text>
            </Box>
          </Box>

          <SeparatorVer.Root
            className="SeparatorRoot"
            decorative
            orientation="vertical"
            style={{ borderColor: 'white', borderStyle: 'solid', borderWidth: '1px', height: '45px' }}
          />

          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <MdOutlineTimer style={{ fontSize: "1.8rem", marginRight: "10px"}}/>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="5" weight="bold" style={{ color: "white" }}>
                Tracked
              </Text>
              <Text size="4" style={{ color: "#BB86FC" }}>
                {stats.tracked}h <span>{stats.trackedHoursChange} hours</span>
              </Text>
            </Box>
          </Box>

          <SeparatorVer.Root
            className="SeparatorRoot"
            decorative
            orientation="vertical"
            style={{ borderColor: 'white', borderStyle: 'solid', borderWidth: '1px', height: '45px' }}
          />

          <Box style={{ display: 'flex', alignItems: 'center', marginRight: "50px" }}>
            <FaChartLine  style={{ fontSize: "1.6rem", marginRight: "10px"}}/>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="5" weight="bold" style={{ color: "white" }}>
                Efficiency
              </Text>
              <Text size="4" style={{ color: "#BB86FC" }}>
                {stats.efficiency}% <span>{stats.efficiencyChange}</span>
              </Text>
            </Box>
          </Box>
        </Flex>
        <Separator orientation="horizontal" size="4" mt="20px" mb="20px" />
        {/* Stats Section */}
        {/* Line Chart Section using Recharts */}
        <Box mb="20px">
          <Text size="5" weight="bold" style={{ color: "white" }}>
            Performance
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#BB86FC" />
              <YAxis stroke="#BB86FC" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="thisMonth"
                stroke="#03DAC6"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="lastMonth" stroke="#BB86FC" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Current Tasks Section */}
        <Box mb="20px">
          <Text size="5" weight="bold" style={{ color: "white" }}>
            Current Tasks
          </Text>
          <Box mt="10px">
            <EmsCallContainer
              title="Live EMS Calls"
              conversations={mockData.filter(
                (conversation) => conversation.isLive
              )}
              setSelectedConversation={setSelectedConversation}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default UserDashboard;
