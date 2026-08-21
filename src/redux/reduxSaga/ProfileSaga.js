import { call, put, select, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getApi,
  postApi,
  putApi,
} from '../../utils/helpers/ApiRequest';

import {
  userDetailsSuccess,
  userDetailsFailure,
} from '../reducer/ProfileReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import {
  getTokenSuccess,
  logoutRequest,
  logoutSuccess,
} from '../reducer/AuthReducer';
import constants from '../../utils/helpers/constants';
import ShowMessage from '../../utils/helpers/ShowMessage';
let getItem = state => state.AuthReducer;

//User Profile Details

export function* userDetailsSaga(action) {
  let items = yield select(getItem);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'getProfile', header);

    if (response?.data?.meta?.code == 200) {
      yield put(userDetailsSuccess(response?.data?.data));
    } else {
      yield put(userDetailsFailure(response?.data));
      showErrorAlert(response?.data?.meta?.message);
    }
  } catch (error) {
    console.log('error>>>>>>>>>>', error);

    yield put(userDetailsFailure(error?.response?.data));
    if (error?.response?.data?.meta?.message == 'Token is invalid or expired') {
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(getTokenSuccess(null));
      yield put(logoutSuccess());
    }
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Profile/userDetailsRequest', userDetailsSaga);
  })(),
];

export default watchFunction;
