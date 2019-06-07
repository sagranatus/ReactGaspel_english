
export default toShortFormat = function(date) {

    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    
    var day = date.getDate();
    var month_index = date.getMonth();
    var year = date.getFullYear();
    
    return month_names[month_index] + " " + day + " " + year;
}
