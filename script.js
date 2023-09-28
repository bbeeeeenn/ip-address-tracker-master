const myIcon = L.icon({
	iconUrl: "images/icon-location.svg",
	iconSize: [50, 60],
	iconAnchor: [25, 60],
	popupAnchor: [-3, -76],
});

fetchLocation("");

const button = document.getElementById("submit-btn");
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
			displayMap(data.location.lat, data.location.lng);
			setOutput(data.ip, data.location, data.location.timezone, data.isp);
		})
		.catch((e) => {
			alert(e);
		});
}

function displayMap(lat, lng) {
	const map = L.map("map", {
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
	L.marker([lat, lng], { icon: myIcon }).addTo(map);
	map.on("click", () => {
		map.flyTo([lat + 0.001, lng], 16);
	});
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
