// Map Handler
//MapHandler
//Must generate map using leaflet and a tileset
//Must be able to store user geoLocation
//Must use foresquare API to mark 
// foursquare key : fsq3/KP6m03XQl3DG4CtVtNcYwEjoyHfbhtLuQatcodSiyI=

 async function mapHandler(){
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(mapGenerator);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
      }
      //Takes a position, generates the map
    function mapGenerator(position){
        let map = L.map("map").setView([position.coords.latitude, position.coords.longitude], 13)
        let markers = []
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiZGFyaXVzbTk3IiwiYSI6ImNreW5taWpicDBvcHYyb3AzM2hjODFsa3EifQ.7hzR7vlj0MEdbzs3phPdMg"
        }).addTo(map);
        markMap(position.coords)
        console.log("map generated")
        let selection = document.querySelector("#selection")
        selection.addEventListener("change", ()=>{
            for(let i=0; i < markers.length; i++){
                markers[i].remove()
            }
            markers = []
            console.log(selection.value)
            renderSelection(position,selection.value)
        })

    async function renderSelection(position, placeType){
        
        let response = await fetch(`https://api.foursquare.com/v3/places/search?ll=${position.coords.latitude},${position.coords.longitude}&query=${placeType}&radius=5000`,{
            method: 'GET',
            headers: { Accept : 'application/json', Authorization: 'fsq3/KP6m03XQl3DG4CtVtNcYwEjoyHfbhtLuQatcodSiyI='},
            
            })
        
        let result = await response.json()
        const placeList = result.results
        console.log(placeList)
        for(let i=0; i < placeList.length; i++){
           markers.push(markMap( placeList[i].geocodes.main)) 
        }
    }
    //marks map at position
    function markMap(position){
        return L.marker([position.latitude, position.longitude]).addTo(map)
    }
}

getLocation()
}



mapHandler()

