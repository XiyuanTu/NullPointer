import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface SelectedIdState {
  value: string
}


const initialState: SelectedIdState = {
  value: 'root'
}

export const selectedIdSlice = createSlice({
  name: 'selectedId',
  initialState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string>) => {state.value = action.payload},
  }
})

export const { setSelectedId } = selectedIdSlice.actions
// export const selectCount = (state: RootState) => state.counter.value

export default selectedIdSlice.reducer