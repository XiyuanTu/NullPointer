import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AppsIcon from "@mui/icons-material/Apps";

interface IProps {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ showInfo, setShowInfo }: IProps) => {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 10,
        bottom: 10,
        backgroundColor: "#90caf9",
        width: 40,
        height: 40,
        color: "#F0F8FF",
        ":hover": { backgroundColor: "#007fff" },
      }}
      onClick={() => setShowInfo((state) => !state)}
    >
      {showInfo ? <AppsIcon /> : <InfoIcon />}
    </IconButton>
  );
};

export default ToggleButton;
