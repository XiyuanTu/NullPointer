import { Avatar } from "@mui/material";

interface IProps {
    name: string, 
    image?: string | null
}

const UserAvatar = ({name, image} : IProps) => {
  if (image) {
    return <Avatar src={image} />;
  }

  return (
    <Avatar>{name.substring(0, 1).toUpperCase()}</Avatar>
  );
};

export default UserAvatar;
