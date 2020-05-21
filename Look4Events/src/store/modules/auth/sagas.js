import { Alert } from 'react-native';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '../../../services/api';

import { signInSuccess, signFailure } from './actions';
// eu chamo boa parte das funções 'Sagas' com * pq tem muitas requisições assincronas
export function* signIn({ payload }) {
  try {
    const { name, password } = payload;

    const response = yield call(api.post, 'sessions', {
      name,
      password,
    });

    const { token, user } = response.data;

    /* if (user.issuer) {
      Alert.alert('Erro no login', 'O usuário não é prestador de serviços');
      return;
    } */

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert(
      'Falha na Autenticação',
      'Houve um erro no login, verifique seus dados!'
    );
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, password, issuer } = payload;

    yield call(api.post, 'users', {
      name,
      password,
      issuer,
    });

    // history.push('/');
  } catch (err) {
    Alert.alert(
      'Falha na cadastro',
      'Houve um erro no cadastro, verifique seus dados!'
    );
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  // nhistory.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_IN_SUCCESS', signInSuccess),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
