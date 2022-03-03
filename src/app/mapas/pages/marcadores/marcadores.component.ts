import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number]
}

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

  //Arreglo de amrcadores

  marcadores: MarcadorColor[] = [];

  @ViewChild("mapa") divMapa!: ElementRef;

  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      interactive: false
    });

    this.leerLocalStorage();


  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    }).setLngLat(this.center).addTo(this.mapa);

    this.marcadores.push({
      color: color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on("dragend", () => {
      this.guardarMarcadoresLocalStorage();
    })
  }

  irMarcador(marcador: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marcador.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = []

    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })

    })

    localStorage.setItem("marcadores", JSON.stringify(lngLatArr));


  }

  leerLocalStorage() {
    if (!localStorage.getItem("marcadores")) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem("marcadores")!)

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      }).setLngLat(m.centro!).addTo(this.mapa);

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on("dragend", () => {
        this.guardarMarcadoresLocalStorage();
      })
    });
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
