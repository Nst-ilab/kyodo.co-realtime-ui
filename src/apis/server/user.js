import {loadLogonCacheAPI, getLogonCacheAPI} from '@/apis/client/storage/logoncache'
import {loadUserSettingAPI} from '@/apis/client/storage/usersetting'
import USER from '@/events/user'
import axios from 'axios'

let _instance = null

/**
 * UserAPIの初期化
 * @param {VueInstance} bus Event Bus
 */
export function loadUserAPI (bus) {
  loadLogonCacheAPI(bus)

  // Singleton Pattern
  if (_instance == null) {
    const logonCacheAPI = getLogonCacheAPI()
    const logonCache = logonCacheAPI.getCache()
    if (logonCache) {
      _instance = new UserAPI(bus, logonCache)
    } else {
      _instance = new UserAPI(bus)
      _instance.logout()
    }
  }
}

/**
 * UserAPI
 * ユーザーに関するサーバサイドAPIと接続するためのAPI
 */
class UserAPI {
  /**
   * コンストラクタ
   * @param {VueInstance} bus Event Bus
   * @param {Object} logonCache ログインユーザーのキャッシュ
   */
  constructor (bus, logonCache) {
    this.bus = bus
    // ログイン要求イベントのハンドリング
    this.bus.$on(USER.TRY_LOGIN, (id, pass) => this.login(id, pass))
    // ログアウト要求イベントのハンドリング
    this.bus.$on(USER.TRY_LOGOUT, () => this.logout())
    // サインアップ要求イベントのハンドリング
    this.bus.$on(USER.TRY_SIGNUP, newUser => this.signup(newUser))
    // ユーザ削除要求イベントのハンドリング
    this.bus.$on(USER.TRY_DELETE, () => this.delete())
    // ユーザ更新要求イベントのハンドリング
    this.bus.$on(USER.TRY_MODUSER, modifiedUser => this.moduser(modifiedUser))

    // javascriptではコンストラクタのoverloadができないため
    // パラメータの有無で初期化の方針を判断する
    if (logonCache) {
      this.currentUser = logonCache
      loadUserSettingAPI(this.bus, this.currentUser.userId)
      this.bus.$emit(USER.LOGIN, this.currentUser)
    }
  }
  /**
   * ログイン処理
   * @param {String} id 入力されたユーザーID
   * @param {String} pass 入力されたパスワード
   */
  login (id, pass) {
    axios.post(process.env.ENDPOINT_BASE_URL + '/auth', {userId: id, password: pass})
      .then(response => {
        if (response.status === 200) {
          this.currentUser = Object.assign({}, response.data, {userId: id, password: pass})
          loadUserSettingAPI(this.bus, this.currentUser.userId)
          this.bus.$emit(USER.LOGIN, this.currentUser)
        }
      })
      .catch(() => {
        this.bus.$emit(USER.LOGIN_FAILURE, {reason: 'invelid id or pass'})
      })
  }

  /**
   * ログアウト処理
   */
  logout () {
    if (this.currentUser) {
      axios.delete(process.env.ENDPOINT_BASE_URL + '/auth', {
        headers: {
          Authorization: 'Bearer ' + this.currentUser.token
        }
      }).then(response => {
        this.currentUser = null
        this.bus.$emit(USER.LOGOUT)
      }).catch(() => {
        // XXX: API側でエラー返してもクライアント側はログアウトするようにとりあえず実装
        this.currentUser = null
        this.bus.$emit(USER.LOGOUT)
      })
    } else {
      this.bus.$emit(USER.LOGOUT)
    }
  }

  /**
   * サインアップ処理
   * @param {Object} newUser 入力されたユーザー情報
   */
  signup (newUser) {
    axios.post(process.env.ENDPOINT_BASE_URL + '/user', newUser)
      .then(response => {
        if (response.status === 200) {
          this.bus.$emit(USER.SIGNUP_SUCCESS)
          this.currentUser = Object.assign({}, response.data, {userId: newUser.userId})
          loadUserSettingAPI(this.bus, newUser.userId)
          this.bus.$emit(USER.LOGIN, Object.assign(
            {},
            newUser,
            {token: response.data.token}
          ))
        }
      }).catch(() => {
        this.bus.$emit(USER.SIGNUP_FAILURE)
      })
  }

  /**
   * ユーザ削除処理
   */
  delete () {
    axios.delete(process.env.ENDPOINT_BASE_URL + '/user/' + this.currentUser.userId, {
      headers: {
        Authorization: 'Bearer ' + this.currentUser.token
      }
    }).then(response => {
      if (response.status === 200) {
        this.bus.$emit(USER.DELETE_SUCCESS)
        this.currentUser = null
        this.bus.$emit(USER.LOGOUT)
      }
    }).catch(() => {
      this.bus.$emit(USER.DELETE_FAILURE)
    })
  }
  
  /**
   * ユーザ更新処理
   */
  moduser (modifiedUser) {
    console.log(modifiedUser)
    axios.put(process.env.ENDPOINT_BASE_URL + '/user/' + this.currentUser.userId, {userId: this.currentUser.userId, name: modifiedUser.name, mobile: modifiedUser.mobile, password: modifiedUser.password}, {
      headers: {
        Authorization: 'Bearer ' + this.currentUser.token
      }
    }).then(response => {
      if (response.status === 200) {
        this.bus.$emit(USER.MODUSER_SUCCESS)
      }
    }).catch(() => {
      this.bus.$emit(USER.MODUSER_FAILURE)
    })
  }
}
