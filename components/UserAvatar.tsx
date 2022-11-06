import { Avatar } from "@mui/material";

interface IProps {
    name: string, 
    image?: string | null
    sx?: {} 
}

const UserAvatar = ({name, image, sx} : IProps) => {
  if (image) {
    return <Avatar src={image} sx={sx}/>;
  }

  return (
    <Avatar sx={sx}>{name.substring(0, 1).toUpperCase()}</Avatar>
  );
};

export default UserAvatar;
