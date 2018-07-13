<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div>
              <h3 class="headline mb-0">自分の位置情報</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <!--2018/7/11 Taiko:表示領域が邪魔だったので変更-->
            <v-card v-if='userSetting.geolocationEnabled && location'>
              <v-card-actions >
                <v-btn color="teal" flat @click="selectedItemsValue='経度:'+location.coords.latitude">
                  <v-icon>mdi-earth</v-icon>
                  <span>緯度</span>
                </v-btn>
                <v-btn color="teal" flat @click="selectedItemsValue='緯度:'+location.coords.longitude">
                  <v-icon>mdi-earth</v-icon>
                  <span>経度</span>
                </v-btn>
                <v-btn color="teal" flat @click="selectedItemsValue='時刻:'+location.timestamp">
                  <v-icon>mdi-clock</v-icon>
                  <span>取得時刻</span>
                </v-btn>
                <v-btn color="teal" flat @click="selectedItemsValue='あなたの一番近くにいる人は'+nearPerson.userid+'です('+nearPerson.distance+'m)'" >
                  <v-icon>mdi-human-greeting</v-icon>
                  <span>近くの人</span>
                </v-btn>
              </v-card-actions>
              <v-card-title>
                <span>{{selectedItemsValue}}</span>
              </v-card-title>
            </v-card>
            <v-alert :value="userSetting.geolocationEnabled && !location" color="info" icon="mdi-clock-alert">
              位置情報取得中
            </v-alert>
            <v-alert :value="!userSetting.geolocationEnabled" color="warning" icon="mdi-alert">
              位置情報共有停止中
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-switch label="位置情報を共有する" @change="geoEnabledChange" v-model="userSetting.geolocationEnabled"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import USERSETTING from '@/events/usersetting'
import MEMBERLOCATIONS from '@/events/memberlocations'

/**
 * MyLocation Component
 * 自分の位置情報パネル
 * @prop {VueInstance} bus Event Bus
 * @prop {Object} userLocation ユーザーの位置情報
 * @prop {Object} userSetting ユーザーの設定値
 */
export default {
  name: 'MyLocation',
  props: ['bus', 'userLocation', 'userSetting'],
  // コンポーネント内のローカル変数
  data: function () {
    return {
          selectedItemsValue: '' ,
          locations:[]}
  },
  methods: {
    /**
     * 「位置情報を共有する」設定の切り替え時のイベントハンドラ
     */
    geoEnabledChange (val) {
      this.bus.$emit(USERSETTING.SET_SETTING, 'geolocationEnabled', val)
    }
  },
  created: function () {
    // みんなの位置情報更新イベントのハンドリング
    this.bus.$on(MEMBERLOCATIONS.UPDATED, locations => {
      this.locations = locations
      return true
    })
  },
  computed: {
    /**
     * 表示する位置情報の前処理
     */
    location () {
      if (!this.userLocation) {
        return null
      }
      
      // GeoLocationAPIのtimestampはUNIX TIMEで返ってくるので、表示用に文字列に変換
      const timestampDate = new Date(this.userLocation.timestamp).toLocaleString()
      return Object.assign({}, this.userLocation, {timestamp: timestampDate})
    },
    nearPerson: function() {
      const locations = this.locations;
      //TODO:①すべての人の情報(locations)から
      // 近くの人の位置情報(returnの値)に変換する処理を書く
      var mylat = this.userLocation.coords.latitude;
      var mylng = this.userLocation.coords.longitude;
      var distance = locations.map(function(value){
        var mode = false;
		    var radlat1 = mylat * Math.PI / 180.0; //経度1
		    var radlon1 = mylng * Math.PI / 180.0; //緯度1
		    var radlat2 = value.position.lat * Math.PI / 180.0; //経度2
		    var radlon2 = value.position.lng * Math.PI / 180.0; //緯度2
    		//平均緯度
    		var radLatAve = (radlat1 + radlat2) / 2;
    		//緯度差
    		var radLatDiff = radlat1 - radlat2;
    		//経度差算
    		var radLonDiff = radlon1 - radlon2;
    
    		var sinLat = Math.sin(radLatAve);
    		if(mode==true){
    			//mode引数がtrueなら世界測地系で計算（デフォルト）
    			var tmp =  1.0 - 0.00669438 * (sinLat*sinLat);
    			var meridianRad = 6335439.0 / Math.sqrt(tmp*tmp*tmp); // 子午線曲率半径
    			var dvrad = 6378137.0 / Math.sqrt(tmp); // 卯酉線曲率半径
    		}else{
    			//mode引数がfalseなら日本測地系で計算
    			var tmp = 1.0 - 0.00667478 * (sinLat*sinLat);
    			var meridianRad = 6334834.0 / Math.sqrt(tmp*tmp*tmp); // 子午線曲率半径
    			var dvrad = 6377397.155 / Math.sqrt(tmp); // 卯酉線曲率半径
    		}
    		var t1 = meridianRad * radLatDiff;
    		var t2 = dvrad * Math.cos(radLatAve) * radLonDiff;
    		var dist = Math.sqrt((t1*t1) + (t2*t2));
        var distance = {
          dist: Math.floor(dist),
          userId: value.userId
        }
        return distance;
        
      });
        distance.sort(function(a,b){
            if(a.dist<b.dist) return -1;
            if(a.dist>b.dist) return 1;
            return 0;
        });
      return {
        distance :distance[1].dist,
        userid:distance[1].userId
      }
      
    }
  }
}
</script>
