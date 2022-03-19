import Axios from '../index'
import { extractApiError } from '../../utils/error'
import { user_login, updateUser } from '../appstore/actions/actions'
import { transactionHistory } from '../transactions'
import appStore from '../appstore'

const store = appStore().store

const getUserProfile = () => {
  return store.getState().user
}

const isUserSignedIn = () => {
  const { isSignedIn } = getUserProfile()
  return isSignedIn
}
const userHasPin = () => {
  const { pin } = getUserProfile().payLoad
  return !!pin
}
const userToken = () => {
  const { token } = getUserProfile().payLoad
  return token
}

const registerUser = async (payload) => {
  try {
    await Axios.post('/register', payload)
  } catch (error) {
    throw extractApiError(error)
  }
}

const pollUser = async () => {
  const token = userToken()
  const accountNumber = store.getState().user.payLoad.accountNumber.toString()
  try {
    const res = await Axios.get(`/user/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    store.dispatch(updateUser(res.data.message, true))
    await transactionHistory()
  } catch (error) {
    throw extractApiError(error)
  }
}

const userLogin = async (payLoad) => {
  try {
    const resp = await Axios.post('/login', payLoad)
    store.dispatch(user_login(resp.data.message, true))
    return resp
  } catch (error) {
    throw extractApiError(error)
  }
}

const resetPin = async (pin, accountNumber) => {
  const body = { pin }
  try {
    await Axios.post('/pinreset', body)
  } catch (error) {
    throw error
  }
}

const signOut = () => {
  try {
    localStorage.clear()
    store.dispatch(user_login({}, false))
  } catch (error) {
    throw error
  }
}

const createPin = async (pin) => {
  const payLoad = {
    accountNumber: getUserProfile().payLoad.accountNumber.toString(),
    pin,
  }
  try {
    await Axios.patch('/createpin', payLoad)
    await pollUser()
  } catch (error) {
    throw extractApiError(error)
  }
}

const fetchUser = async () => {
  let accountNumber = store.getState().user.payLoad.accountNumber.toString()
  try {
    const res = await Axios.get('/user/' + accountNumber)
    console.log(res)
  } catch (error) {
    console.log(error)
    throw extractApiError(error)
  }
}

export {
  signOut,
  pollUser,
  resetPin,
  fetchUser,
  createPin,
  userToken,
  userLogin,
  userHasPin,
  registerUser,
  isUserSignedIn,
  getUserProfile,
}
