import { requestOptions } from '../utils';
// center of the map
const map = (longlat) => {
    document.getElementById('mymap').innerHTML = "<div id='map' class='h-48'></div>";

    var center = [longlat.split(", ")[0], longlat.split(", ")[1]];
    var map = L.map('map', {
        center: center,
        zoom: 18
    });
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
    L.marker(center).addTo(map);
    return map;
}

export default map;

