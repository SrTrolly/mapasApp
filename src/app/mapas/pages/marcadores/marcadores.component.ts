import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
   .mapa-container{
    height:100%;
    width:100%
  }

  .row{
    background-color:white;
    border-radius:5px;
    bottom:50px;
    left:50px;
    paddin:10px;

    position:fixed;
    z-index: 999;
  }
  .list-group{
    position:fixed;
    top:20px;
    right:20px;
    z-index:99;
  }

  li{
    cursor:pointer;
  }
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  mapa!: mapboxgl.Map
  zoomLevel: number = 15;
  center: [number, number] = [-70.74075651687191, -33.49174938173057]

  @ViewChild("mapa") divMapa!: ElementRef;

  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: this.center,
      zoom: this.zoomLevel
    });


  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    }).setLngLat(this.center).addTo(this.mapa);
  }

  irMarcador() {

  }



}
