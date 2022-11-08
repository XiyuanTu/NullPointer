import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import ProfileLikes from "./ProfileLikes";
import ProfileNotes from "./ProfileNotes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ProfileTabsProps {
  user: User;
}

const ProfileTabs = ({ user }: ProfileTabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 64,
          bgcolor: "rgb(241, 242, 242)",
          zIndex: 99,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{}}
        >
          <Tab label="Notes" {...a11yProps(0)} sx={{ textTransform: "none" }} />
          <Tab label="Likes" {...a11yProps(1)} sx={{ textTransform: "none" }} />
          <Tab
            label="Bookmarks"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Comments"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Followers"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Following"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
          <Tab
            label="Settings"
            {...a11yProps(2)}
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ProfileNotes user={user} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProfileLikes user={user} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};

export default ProfileTabs;
