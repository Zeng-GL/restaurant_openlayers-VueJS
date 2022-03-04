<template>
  <!--建立 Map div-->
  <div id="map" ref="map-root">
    <!--建立 popup div -->
    <div id="popup" class="ol-popup">
      <a                                                                                                          
        id="popup-closer"
        class="ol-popup-closer"   
        @click="closePopup"
      ></a>
      <div id="popup-content"></div>
    </div>     
  </div>                                                                
</template>

<script>
import "ol/ol.css"; // OpenLayers 專用 CSS
import OSM from "ol/source/OSM"; // 使用 Open Street Map (OSM)底圖
import Map from "ol/Map"; // OpenLayers地圖元件
import View from "ol/View"; // OpenLayers View 元件，用於設定地圖初始中心點、Zoom大小
import { Tile as TileLayer } from "ol/layer"; // OpenLayers圖層元件

import { Vector as VectorLayer } from "ol/layer"; // Marker圖層
import VectorSource from "ol/source/Vector"; // Marker圖層來源
import Feature from "ol/Feature"; // Marker內含資訊(包含座標，或是可以任意新增資訊)
import { Icon, Style } from "ol/style"; // Marker樣式
import { Point } from "ol/geom"; // ???
import { transform } from "ol/proj"; //地圖投影座標轉換
import {fromLonLat} from "ol/proj"; //地圖投影座標轉換
import Overlay from "ol/Overlay";  // popup使用

export default {
  name: "Map",
  props:{
    restaurant: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // map + view
      map: null,
      view: null,
      // marker
      markerLayer: null,
      markerSource: null,  
      // popup                                                              
      overlay: null,
    };
  },
  methods: {
    // 初始化地圖
    initMap() {
       const container = document.getElementById("popup");
        const content = document.getElementById("popup-content");
        this.overlay = new Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {                                            
            duration: 250,
          },
        });
      //初始View物件，將值帶入view全域變數
      this.view = new View({  
        // 地圖初始中心(將一般使用座標轉換成投影在地圖上的座標)
        center: fromLonLat([121.53670561802547, 25.04477682002577]), // fromLonLat顧名思義就是要先放經度，再放緯度。若順序相反，則地圖無法正常顯示
        // 初始解析大小
        zoom: 12,
        // 最小和最大解析度(非必要可自訂)
        // minZoom: 13,
        // maxZoom: 15,
      });
      // 地圖元件: 整合以下: (1)地圖位於html位置 (2)layers圖層 (3)上面設定的View解析度
      this.map = new Map({
        target: this.$refs["map-root"], // 地圖位於html位置
        layers: [
          new TileLayer({
            //圖磚圖層(非向量)
            source: new OSM(), // 圖層需要設定其來源，這裡使用最基礎的OSM
            opacity: 1, //圖層透明度，預設為1，可依需求調整透明度
          }),
        ],
        view: this.view, // View解析度
      });
      this.markerSource = new VectorSource(); //初始化marker圖層來源
      this.markerLayer = new VectorLayer({ 
        source: this.markerSource, // 引入圖層來源
        style: new Style({ //設置marker樣式
          image: new Icon({
            anchor: [0.5, 1], // marker位置
            src: "https://i.imgur.com/wXxeCFR.png", // marker圖檔
            scale: 0.5, // marker大小
          }),
        }),
      });
      
      this.map.addLayer(this.markerLayer); //將marker圖層加到地圖上
      
      this.addSellrestaurant() // 呼叫 function 將 marker 加到地圖上

      this.map.on("click", (evt) => {

        const feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            console.log(feature.values_);


            let flatCoordinate = feature.values_.geometry.flatCoordinates;
            let Coordinate = transform(
              flatCoordinate,
              "EPSG:3857",
              "EPSG:4326"
            );
            feature.reverse_coords = {
              lat: Coordinate[1],
              lng: Coordinate[0],
            };
            return feature;
          }
        );
        if (feature) {
         content.innerHTML =
          "<span class='popup-text'>餐廳名字:</span>"+
          feature.values_.name +
          "<br>"+
          "<span class='popup-text'>餐廳地址:</span>"+
          feature.values_.location +
          "<br>"+
          "<span class='popup-text'>推薦美食:</span>"+
          feature.values_.food

          content.classList.add("popup-text")

         this.overlay.setPosition(feature.getGeometry().getCoordinates());
         this.map.addOverlay(this.overlay)
        }else{
          this.overlay.setPosition(undefined);
        }
      })
    },
     createSellrestaurant(lng, lat, name,location,food) { // 新增座標點，並將地點資訊加到對應的marker上
      return new Feature({
        geometry: new Point(transform([lat, lng], "EPSG:4326", "EPSG:3857")), //如果是transform[lng,lat]，座標會無法出現
        name: name, 
        location:location,
        food:food,
      })                              
    },

    addSellrestaurant() { // 讀取從父元件Home.vue 用 props 傳過來的陣列
      try {
        for (let i = 0; i < this.restaurant.length; i++) {
          this.markerLayer
            .getSource()
            .addFeature(
              this.createSellrestaurant(
                this.restaurant[i].lat,
                this.restaurant[i].lng,
                this.restaurant[i].name,
                this.restaurant[i].location,
                this.restaurant[i].food,
              )
            )                                                                                         
        }
      } catch (error) {
        console.log(error);
      }
    },
    closePopup() { // 關閉popup
      const closer = document.getElementById("popup-closer");
      this.overlay.setPosition(undefined);
      closer.blur();
      return false;
    },
  },
  // 在mounted階段初始化地圖
  // 如果在created階段就初始化地圖，會變成一片空白，因為此階段放置地圖的div尚未被創建
  mounted() {
    this.initMap();
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: relative;
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 400px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
.popup-text {
  font-weight: bolder;
  line-height: 35px;
}
</style>