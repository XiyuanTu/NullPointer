import {useState, useEffect} from 'react'
import {List , Box} from '@mui/material';
import ContentItem from './ContentItem';

interface IProps {
  notes: ForumNote[],
  user: User
}

const ForumContent = ({notes, user} : IProps) => {

  const [currentUser, setCurrentUser] = useState(user)
  const [currentNotes, setCurrentNotes] = useState(notes)

  return (
    <Box>
      {
        currentNotes.map((note) => <ContentItem key={note._id} note={note} user={currentUser} setCurrentUser={setCurrentUser} setCurrentNotes={setCurrentNotes}/>)
      }
    </Box>
        

  )
}

export default ForumContent