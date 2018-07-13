/**
 * ユーザー関連イベント
 */
const USER = {
  LOGIN: 'user.login', // ログイン
  LOGOUT: 'user.logout', // ログアウト
  TRY_LOGIN: 'user.try-login', // ログイン要求
  TRY_LOGOUT: 'user.try-logout', // ログアウト要求
  LOGIN_FAILURE: 'user.login-failure', // ログイン失敗
  TRY_SIGNUP: 'user.try-signup', // サインアップ要求
  SIGNUP_SUCCESS: 'user.signup-success', // サインアップ成功
  SIGNUP_FAILURE: 'user.signup-failure', // サインアップ失敗
  TRY_DELETE: 'user.try-delete', // ユーザ削除要求
  DELETE_SUCCESS: 'user.delete-success', // ユーザ削除成功
  DELETE_FAILURE: 'user.delete-failure',// ユーザ削除失敗
  TRY_MODUSER: 'user.try-moduser', // ユーザ更新要求
  MODUSER_SUCCESS: 'user.moduser-success', // ユーザ更新成功
  MODUSER_FAILURE: 'user.moduser-failure' // ユーザ更新失敗
}

export default USER
