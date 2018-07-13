<template>
  <v-toolbar app>
    <v-toolbar-title>map kyodo-co</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-menu bottom offset-y v-if="logonUser">
        <v-btn slot="activator" flat>
          <v-icon>mdi-account-outline</v-icon>{{logonUser.name}}
        </v-btn>
        <v-list>
          <v-list-tile  @click="$router.replace('/moduser')">
            <v-list-tile-content>
              <v-list-tile-title><v-icon>settings</v-icon>UserSetting</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile  @click="onLogoutClick">
            <v-list-tile-content>
              <v-list-tile-title><v-icon>mdi-logout</v-icon>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile  @click="onUnsubscribeClick">
            <v-list-tile-content>
              <v-list-tile-title><v-icon>mdi-delete-forever</v-icon>Unsubscribe</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>

</template>

<script>
import USER from '@/events/user'

/**
 * HeaderToolbar Component
 * 画面のヘッダ
 * @see https://vuetifyjs.com/ja/components/toolbars
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} logonUser ログイン中のユーザー
 */
export default {
  name: 'HeaderToolbar',
  props: ['bus', 'logonUser'],
  /**
   * ヘッダメニュー内のログアウトボタン押下時のイベントハンドラ
   */
  methods: {
    onLogoutClick: function () {
      this.bus.$emit(USER.TRY_LOGOUT)
    },
    onUnsubscribeClick: function () {
      this.bus.$emit(USER.TRY_DELETE)
    }
  }
}
</script>
