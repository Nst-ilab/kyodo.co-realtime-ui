<template>
  <v-data-table
    :items="allLocations"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="row">
      <td><v-btn :href=row.item.tellCall><v-icon>perm_phone_msg</v-icon></v-btn></td>
      <td>{{ row.item.name }}</td>
      <td>{{ row.item.position.lat }}</td>
      <td>{{ row.item.position.lng }}</td>
      <td>{{ row.item.address }}</td>
    </template>
  </v-data-table>
</template>

<script>
import MEMBERLOCATIONS from '@/events/memberlocations'

/**
 * MemberLocation Component
 * みんなの位置パネル
 * @see https://github.com/Akryum/vue-googlemaps
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} logonUser ログイン中のユーザー情報
 * @prop {Object} userLocation ログオンユーザーの位置情報
 * @state {Array} locations マップ上に表示すべき位置情報
 */
export default {
  name: 'MemberList',
  props: ['bus', 'userLocation'],
  data: function () {
    return {
      locations: []
    }
  },
  created: function () {
    // みんなの位置情報更新イベントのハンドリング
    this.bus.$on(MEMBERLOCATIONS.UPDATED, locations => {
      this.locations = locations
      return true
    })
  },
  methods: {

  },
  computed: {
    /**
     * 表示すべき位置情報の前処理
     */
    allLocations: function () {
      return this.locations.map(function (value) {
        var tellCall = 'tel:' + value.mobile
        value['tellCall'] = tellCall
        return value
      })
    }
  }
}
</script>
