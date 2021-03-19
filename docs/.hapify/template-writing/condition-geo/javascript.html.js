let output = '';
if (model.properties.isGeolocated) {
    output += `<app-map-position-picker [model]="${model.names.camel}"></app-map-position-picker>`
}
return output;