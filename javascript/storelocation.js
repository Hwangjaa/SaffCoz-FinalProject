function updateMap(location) {
    const mapImage = document.getElementById('store-map');
    if (location === 'kemanggisan') {
      mapImage.src = '/asset/location/BINUS Kemanggisan.png';
    } else if (location === 'bandung') {
      mapImage.src = '/asset/location/BINUS Bandung.png';
    } else if (location === 'malang') {
      mapImage.src = '/asset/location/BINUS Malang.png';
    }
  }
  