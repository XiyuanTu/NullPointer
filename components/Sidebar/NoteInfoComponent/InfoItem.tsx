import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface IProps {
  icon: SvgIconComponent;
  label: string;
  info: string;
}

const InfoItem = ({ icon: Icon, label, info }: IProps) => {
  return (
    <Box
      sx={{ display: "flex", ml: 2, mb: 2, alignItems: "center", width: "90%" }}
    >
      <Tooltip title={label} arrow>
        <Icon sx={{ mr: 2, fontSize: 20 }} />
      </Tooltip>
      <Typography noWrap={true} sx={{ fontSize: 15 }}>
        {info}
      </Typography>
    </Box>
  );
};

export default InfoItem;
