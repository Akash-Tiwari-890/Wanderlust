// const { coordinates } = require("@maptiler/sdk");



     
      maptilersdk.config.apiKey = mapToken;
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: listing.geometry.coordinates ,// starting position [lng, lat]
        zoom: 11.7, // starting zoom
      });



     

const marker = new maptilersdk.Marker({
  color: "red",
  draggable: true
}).setLngLat(listing.geometry.coordinates)//Listing.geometry.corrdinates
  .setPopup(new maptilersdk.Popup().setHTML(`<h4>${listing.location}</h4><p>Excat Location probided after Booking</p>`)) // Add a popup 
.addTo(map);
