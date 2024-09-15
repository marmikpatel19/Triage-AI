import React, { useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import iconImage from "../vivek_icon.jpg"; // Import your icon image

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [search, setSearch] = useState("");

  return (
    <Box
      style={{
        position: "sticky",
        top: 0,
        background: "rgba(255, 255, 255, 0.001)", // Semi-transparent background
        backdropFilter: "blur(4px)", // Add blur effect
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {/* Left-aligned title */}
      <Text
        size="5"
        weight="bold"
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        {title}
      </Text>

      {/* Centered search bar */}
      <Flex style={{ flex: 1, justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            width: "20rem",
            fontSize: "1rem",
            color: "white",
            textAlign: "center", // Center align the input text
          }}
        />
      </Flex>

      {/* Right-aligned icon */}
      <Box
        as="span"
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={iconImage}
          alt="Icon"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default Header;
