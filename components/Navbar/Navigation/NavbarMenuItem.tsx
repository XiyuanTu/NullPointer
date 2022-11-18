import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { Tooltip, IconButton, Badge, Box } from "@mui/material";
interface IProps {
  icon: SvgIconComponent;
  tooltipTitle: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

const NavbarMenuItem = ({
  icon: Icon,
  tooltipTitle,
  onClick,
  disabled,
}: IProps) => {
  return (
    <Tooltip title={tooltipTitle} arrow>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #E2E8F0",
          width: "2rem",
          height: "2rem",
          borderRadius: "0.5rem",
          ":hover": {
            borderColor: "#CBD5E1",
            bgcolor: "#fafafa",
            cursor: "pointer",
          },
        }}
      >
        <span>
          <IconButton
            sx={{ "&:hover": { bgcolor: "transparent" } }}
            disabled={disabled}
            onClick={onClick}
          >
            <Icon
              sx={{
                color: "primary.main",
                flex: 1,
                fontSize: "1.25rem",
                lineHeight: "1.75rem",
              }}
            />{" "}
          </IconButton>
        </span>
      </Box>
    </Tooltip>
  );
};

export default NavbarMenuItem;
