<template>
  <v-container fluid class="container-fluid">
    <v-row>
      <v-col cols="12" sm="9" md="9" bg="9">
        <div class="map-box">
          <imap 
          :restaurant="restaurant"
          />
        </div>
      </v-col>
       <v-col cols="12" sm="3" md="3" bg="3">
         <v-card v-for="item in restaurant" :key="item.id" class="restaurant-info-card">
           <h3>{{ item.name }}</h3>
           <p><span>餐廳地址:</span><span>{{item.location}}</span></p>
           <p><span>推薦美食:</span><span>{{item.food}}</span></p>
         </v-card>
       </v-col>
    </v-row>
  </v-container>
</template>

<script>
import imap from "./Map.vue"
import restaurant from "../assets/restaurant.json"

export default {
  components: {
    imap,
  },
  data(){
    return{
      restaurant:[],
    }
  },
  created(){
    this.restaurant = Object.assign([],restaurant)
  },
};
</script>

<style lang="scss" scoped>

/*務必設定放置地圖div的高度
高度只能用vh、rem、px等實際數字表示，不可用%表示，否則地圖高度會顯示為0*/
.map-box {
  height: 100vh;
  width: 100%;
}

.container-fluid{
  padding: 0rem;
  margin: 0rem;
  overflow: hidden;
}
.restaurant-info-card{
  padding: 1rem;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: start;
}
</style>
