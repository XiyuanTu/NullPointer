import {useState, useEffect} from 'react'
import {List , Box} from '@mui/material';
import ContentItem from './ContentItem/';

interface IProps {
  notes: ForumNote[],
  user: User
}

const ForumContent = ({notes, user} : IProps) => {

  const [currentUser, setCurrentUser] = useState(user)

  return (
    <Box>
      {
        notes.map((note) => <ContentItem key={note._id} note={note} user={currentUser} setCurrentUser={setCurrentUser}/>)
      }
    </Box>
        

  )
}

export default ForumContent