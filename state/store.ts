import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './slices/loginSlice'
import feedbackReducer from './slices/feedbackSlice'
import selectedIdReducer from './slices/selectedIdSlice'
import noteReducer from './slices/noteSlice'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    selectedId: selectedIdReducer,
    feedback: feedbackReducer,
    note: noteReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch