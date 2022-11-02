import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface NoteState {
  value: Note | undefined
}


const initialState: NoteState = {
  value: undefined
}

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNote: (state, action: PayloadAction<Note | undefined>) => {state.value = action.payload},
  }
})

export const { setNote } = noteSlice.actions
// export const selectCount = (state: RootState) => state.counter.value

export default noteSlice.reducer