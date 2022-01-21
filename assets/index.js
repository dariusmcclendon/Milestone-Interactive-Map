// Map Handler
//MapHandler
//Must generate map using leaflet and a tileset
//Must be able to store user geoLocation
//Must use foresquare API to mark 
// foursquare key : fsq3/KP6m03XQl3DG4CtVtNcYwEjoyHfbhtLuQatcodSiyI=

//We are wrapping all of our function inside mapHandler for the sake of encapsulation
 async function mapHandler(){
     //this function will be called inside mapHandler in order to kickstart the whole thing
     //getLocation gets the users location and uses mapGenerator as a callback in order to encapsulate the user's location
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
        let markers = [] //for the purpose of removing markers no longer in use
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiZGFyaXVzbTk3IiwiYSI6ImNreW5taWpicDBvcHYyb3AzM2hjODFsa3EifQ.7hzR7vlj0MEdbzs3phPdMg"
        }).addTo(map);
        markMap(position.coords) //marks the map at the user's location
        console.log("map generated")
        let selection = document.querySelector("#selection") //this is the code block for getting the value of the selection
        selection.addEventListener("change", ()=>{ //this event fires when the selection is changed
            for(let i=0; i < markers.length; i++){
                markers[i].remove() //deleting the markers inside the array
            }
            markers = [] //clearing the array proper
            console.log(selection.value)
            renderSelection(position,selection.value) //using renderSelection as a callback inside the anon function for this event listener
        })

    async function renderSelection(position, placeType){ //This will render the selection markers
        
        //fetch code block, using foursquare's API to get what we need
        let response = await fetch(`https://api.foursquare.com/v3/places/search?ll=${position.coords.latitude},${position.coords.longitude}&query=${placeType}&radius=5000`,{
            method: 'GET',
            headers: { Accept : 'application/json', Authorization: 'fsq3/KP6m03XQl3DG4CtVtNcYwEjoyHfbhtLuQatcodSiyI='},
            
            })
        //turning fetch request into a proper object
        let result = await response.json()
        const placeList = result.results
        console.log(placeList)
        //iterating through the list of places fetched from foursquare
        for(let i=0; i < placeList.length; i++){
           markers.push(markMap( placeList[i].geocodes.main)) //placing the markers inside the markers array while generating them
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

