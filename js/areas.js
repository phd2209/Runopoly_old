

var areas = [];

var Area = function (id, name, coordinates) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
};

var area1 = new Area(1, name = "Utterslevmose", 
[{ "longitude": 55.715073, "latitude": 12.487366 },
{ "longitude": 55.716789, "latitude": 12.488975 },
{ "longitude": 55.716959, "latitude": 12.492322 },
{ "longitude": 55.718210, "latitude": 12.496871 },
{ "longitude": 55.720572, "latitude": 12.500004 },
{ "longitude": 55.720536, "latitude": 12.501549 },
{ "longitude": 55.719968, "latitude": 12.506077 },
{ "longitude": 55.720409, "latitude": 12.508791 },
{ "longitude": 55.719889, "latitude": 12.512997 },
{ "longitude": 55.722693, "latitude": 12.514778 },
{ "longitude": 55.725430, "latitude": 12.516784 },
{ "longitude": 55.727328, "latitude": 12.518651 },
{ "longitude": 55.727805, "latitude": 12.519681 },
{ "longitude": 55.728047, "latitude": 12.521473 },
{ "longitude": 55.727581, "latitude": 12.523854 },
{ "longitude": 55.726065, "latitude": 12.523854 },
{ "longitude": 55.725847, "latitude": 12.523018 },
{ "longitude": 55.723660, "latitude": 12.521955 },
{ "longitude": 55.722536, "latitude": 12.523002 },
{ "longitude": 55.721328, "latitude": 12.523802 },
{ "longitude": 55.720461, "latitude": 12.524842 },
{ "longitude": 55.720340, "latitude": 12.525835 },
{ "longitude": 55.720914, "latitude": 12.527224 },
{ "longitude": 55.720838, "latitude": 12.528185 },
{ "longitude": 55.720113, "latitude": 12.529743 },
{ "longitude": 55.719451, "latitude": 12.528981 },
{ "longitude": 55.719006, "latitude": 12.528139 },
{ "longitude": 55.718587, "latitude": 12.526707 },
{ "longitude": 55.718028, "latitude": 12.519971 },
{ "longitude": 55.716650, "latitude": 12.519327 },
{ "longitude": 55.717617, "latitude": 12.513061 },
{ "longitude": 55.717502, "latitude": 12.511860 },
{ "longitude": 55.716844, "latitude": 12.511260 },
{ "longitude": 55.715139, "latitude": 12.510627 },
{ "longitude": 55.714759, "latitude": 12.509430 },
{ "longitude": 55.714747, "latitude": 12.507311 },
{ "longitude": 55.714218, "latitude": 12.506233 },
{ "longitude": 55.712586, "latitude": 12.504399 },
{ "longitude": 55.711546, "latitude": 12.499705 },
{ "longitude": 55.712293, "latitude": 12.497146 },
{ "longitude": 55.712482, "latitude": 12.496047 },
{ "longitude": 55.712364, "latitude": 12.495357 },
{ "longitude": 55.712036, "latitude": 12.494756 },
{ "longitude": 55.711249, "latitude": 12.494247 },
{ "longitude": 55.710975, "latitude": 12.493338 },
{ "longitude": 55.711016, "latitude": 12.492377 },
{ "longitude": 55.711135, "latitude": 12.491034 },
{ "longitude": 55.711061, "latitude": 12.490116 },
{ "longitude": 55.710714, "latitude": 12.489312 },
{ "longitude": 55.709124, "latitude": 12.488105 },
{ "longitude": 55.708766, "latitude": 12.486774 },
{ "longitude": 55.708777, "latitude": 12.485940 },
{ "longitude": 55.709346, "latitude": 12.485645 },
{ "longitude": 55.711004, "latitude": 12.485575 },
{ "longitude": 55.712631, "latitude": 12.485982 },
{ "longitude": 55.714683, "latitude": 12.487141 },
{ "longitude": 55.715073, "latitude": 12.487366 }]);
 

var area2 = new Object({
    "id": "2", "name": "Søerne kbh.", "coords": [
    { "longitude": 55.674287, "latitude": 12.555065 },
    { "longitude": 55.681698, "latitude": 12.557167 },
    { "longitude": 55.682206, "latitude": 12.557217 },
    { "longitude": 55.687199, "latitude": 12.562104 },
    { "longitude": 55.691955, "latitude": 12.568970 },
    { "longitude": 55.693963, "latitude": 12.572119 },
    { "longitude": 55.695423, "latitude": 12.573422 },
    { "longitude": 55.697954, "latitude": 12.578593 },
    { "longitude": 55.696007, "latitude": 12.579891 },
    { "longitude": 55.694175, "latitude": 12.576200 },
    { "longitude": 55.692862, "latitude": 12.575042 },
    { "longitude": 55.688998, "latitude": 12.569098 },
    { "longitude": 55.685514, "latitude": 12.564592 },
    { "longitude": 55.680784, "latitude": 12.560493 },
    { "longitude": 55.674378, "latitude": 12.558712 },
    { "longitude": 55.673815, "latitude": 12.555420 },
    { "longitude": 55.674287, "latitude": 12.555065 }]
});
/*
var area2 = new Area("2", "Søerne kbh.", [
{ "longitude": 55.674287, "latitude": 12.555065 },
{ "longitude": 55.681698, "latitude": 12.557167 },
{ "longitude": 55.682206, "latitude": 12.557217 },
{ "longitude": 55.687199, "latitude": 12.562104 },
{ "longitude": 55.691955, "latitude": 12.568970 },
{ "longitude": 55.693963, "latitude": 12.572119 },
{ "longitude": 55.695423, "latitude": 12.573422 },
{ "longitude": 55.697954, "latitude": 12.578593 },
{ "longitude": 55.696007, "latitude": 12.579891 },
{ "longitude": 55.694175, "latitude": 12.576200 },
{ "longitude": 55.692862, "latitude": 12.575042 },
{ "longitude": 55.688998, "latitude": 12.569098 },
{ "longitude": 55.685514, "latitude": 12.564592 },
{ "longitude": 55.680784, "latitude": 12.560493 },
{ "longitude": 55.674378, "latitude": 12.558712 },
{ "longitude": 55.673815, "latitude": 12.555420 },
{ "longitude": 55.674287, "latitude": 12.555065 }]);
*/
areas.push(area1);
areas.push(area2);

