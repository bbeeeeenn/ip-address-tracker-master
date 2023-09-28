const button = document.getElementById("submit-btn");
const myIcon = L.icon({
	iconUrl: "images/icon-location.svg",
	iconSize: [50, 60],
	iconAnchor: [25, 60],
	popupAnchor: [-3, -76],
});

let map;
let displayedMap = false;
let marker = L.marker([0, 0], { icon: myIcon });

fetchLocation("");

button.addEventListener("click", () => {
	const ip = document.getElementById("ip-address-input").value;
	fetchLocation(ip);
});

function fetchLocation(ip) {
	const apiKey = "at_tj99iTAV9LdT6hkmkQVNh2gZMOJU5";
	fetch(
		`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`
	)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error(res.statusText);
			}
		})
		.then((data) => {
			if (!displayedMap) {
				displayMap(data.location.lat, data.location.lng, data);
				displayedMap = true;
			} else if (displayedMap) {
				setMap(data.location.lat, data.location.lng, data);
			}
			setEverythingElse(data);
			setOutput(data.ip, data.location, data.location.timezone, data.isp);
		})
		.catch((e) => {
			alert(e);
			console.log(e);
		});
}

function displayMap(lat, lng, data) {
	map = L.map("map", {
		center: [lat + 0.001, lng],
		zoom: 16,
		attributionControl: false,
		zoomControl: false,
	});
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
}

function setMap(lat, lng, data) {
	map.flyTo([lat, lng]);
}

function setEverythingElse(data) {
	console.log(data);
	const location = data.location;
	marker.setLatLng([location.lat, location.lng]).addTo(map);
	map.on("click", () => {
		map.flyTo([location.lat + 0.001, location.lng], 16);
	});
	marker
		.bindPopup(
			`<ul style="list-style:none">
      <li><b>Country:</b> ${location.country}</li>
      <li><b>Regoin:</b> ${location.region}</li>
      <li><b>City:</b> ${location.city}</li>
      <li><b>Latitude:</b> ${location.lat}</li>
      <li><b>Longitude:</b> ${location.lng}</li>
      ${
			location.postalCode == ""
				? ""
				: `<li><b>Postal Code:</b> ${location.postalCode}</li>`
		}
      
   </ul>`
		)
		.openPopup();
}

function setOutput(ipAdd, location, timeZ, isp) {
	const ipAddressOutput = document.getElementById("ip-address-output");
	const locationOutput = document.getElementById("location-output");
	const timeZOutput = document.getElementById("timezone-output");
	const ispOutput = document.getElementById("isp-output");
	ipAddressOutput.innerText = ipAdd;
	locationOutput.innerText = `${location.region}, ${location.country}`;
	timeZOutput.innerText = `UTC ${timeZ}`;
	ispOutput.innerText = isp;
}
