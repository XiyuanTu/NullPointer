import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface LoginState {
  value: boolean
}


const initialState: LoginState = {
  value: false
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    closeLoginPage: state => {state.value = false},
    openLoginPage: state => {state.value = true},
  }
})

export const { closeLoginPage, openLoginPage } = loginSlice.actions

export default loginSlice.reducer