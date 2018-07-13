<template>
  <v-container fluid>
    <v-alert :value="errorMessage != ''" color="error" icon="mdi-alert">
      {{errorMessage}}
    </v-alert>
    <v-form v-model="valid">
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="username"
            name="username"
            label="Name"
            v-model=currentUser.name
            :rules="usernameRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            id="mobile"
            name="mobile"
            label="携帯電話番号"
            v-model=currentUser.mobile
            :rules="mobileRules"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs10>
          <v-text-field
            id="password"
            name="password"
            label="password"
            :type= "passwordType"
            v-model=currentUser.password
            :rules="passwordRules"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn icon @click="onPasswordIconClick">
            <v-icon>{{passwordIcon}}</v-icon>
          </v-btn>         
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs10>
          <v-text-field
            id="passwordConfirm"
            name="passwordConfirm"
            label="password(confirm)"
            :type="passwordType"
            v-model="passwordConfirm"
            :rules="passwordConfirmRules"
          ></v-text-field>
        </v-flex>
            <v-btn icon @click="onPasswordIconClick">
            <v-icon>{{passwordIcon}}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-btn :disabled="!valid" block color="secondary" @click="onModUserClick">更新</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout row>
      <v-flex xs12>
        <v-btn block outline color="indigo" @click="$router.replace('/home')">戻る</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import USER from '@/events/user'

/**
 * SignUp Component
 * ユーザー新規登録画面
 * @see https://vuetifyjs.com/ja/components/forms
 * @prop {VueInstance} bus Event Bus
 * @state {String} username ユーザー名(入力値)
 * @state {String} mobile 携帯電話番号(入力値)
 * @state {String} password パスワード(入力値)
 * @state {String} errorMessage 登録失敗時のエラーメッセージ
 */
export default{
  name: 'ModUser',
  props: ['bus', 'logonUser'],
  data: function () {
    return {
      userid: '',
      useridRules: [
        v => !!v || 'useridは必須です',
        v => /^[a-zA-Z0-9-_.]*$/.test(v) || 'useridには半角英数と-_.が使用できます',
        v => v.length >= 6  || 'useridは6文字以上にしてください'
      ],
      username: '',
      usernameRules: [
        v => !!v || 'usernameは必須です'
      ],
      mobile: '',
      mobileRules: [
        v => !!v || '携帯電話番号は必須です',
        v => /^[0-9]*$/.test(v) || '携帯電話番号はハイフンなしの半角数字で入力してください。',
        v => v.length == 11  || '携帯電話番号は11桁にしてください'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'passwordは必須です',
        v => /^[a-zA-Z0-9-_.]*$/.test(v) || 'useridには半角英数と-_.が使用できます',
        v => v.length >= 8  || 'passwordは8文字以上にしてください',
        v => /([0-9].*[a-zA-Z]|[a-zA-Z].*[0-9])/.test(v) || 'passwordは半角英数字の組み合わせとしてください',
      ],
      passwordConfirm: '',
      passwordConfirmRules: [
        v => !!v || 'password(confirm)は必須です',
        v => v === this.currentUser.password || 'passwordとpassword(confirm)が一致しません'
      ],
      valid: false,
      errorMessage: '',
      passwordVisible : false
    }
  },
  created: function () {
    // サインアップ失敗イベントのハンドリング
    this.bus.$on(USER.SIGNUP_FAILURE, () => {
      this.errorMessage = '登録に失敗しました。IDが重複しています。'
    })
  },
  methods: {
    /**
     * 更新ボタン押下時のイベントハンドラ
     */
    onModUserClick: function () {
      if (this.valid) {
        this.bus.$emit(USER.TRY_MODUSER, {
          userId: this.currentUser.userid,
          name: this.currentUser.name,
          password: this.currentUser.password,
          mobile: this.currentUser.mobile
        })
      }
    },
    onPasswordIconClick: function(){
      this.passwordVisible = !this.passwordVisible
    }
  },
  computed: {
    passwordType: function(){
      if (this.passwordVisible == true){
        return "text"
      }else {
        return "password" 
      }
    },
    passwordIcon: function(){
      if (this.passwordVisible == false){
        return "mdi-eye-off"
      }else { 
        return "mdi-eye" 
      }
    },
    /**
     * 現在のユーザー情報の前処理
     */
    currentUser: function () {
      const currentUser = {
        userId: this.logonUser.userId,
        name: this.logonUser.name,
        mobile: this.logonUser.mobile,
        password: this.logonUser.password
      }
      return currentUser

    }
  }
}
</script>
