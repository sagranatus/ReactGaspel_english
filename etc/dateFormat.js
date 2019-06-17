
export const toShortFormat = function(date) {

    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    
    var day = date.getDate();
    var month_index = date.getMonth();
    var year = date.getFullYear();
    
    return month_names[month_index] + " " + day + " " + year;
}

export const dateFormat1 = function(when) { // "today" -> 오늘날짜 xxxx-xx-xx // "weekend" -> 이번주 주일날짜 xxxx-xx-xx
    var date = new Date();
    if(when !== "today"){
        // 일요일날짜 구하기
        if(date.getDay() !== 0){ 
            var lastday = date.getDate() - (date.getDay() - 1) - 1;
            date = new Date(date.setDate(lastday));
        }else{
            // 일요일인 경우에는 그대로 값을 가져옴 
            var lastday = date.getDate()
            date = new Date(date.setDate(lastday));
        }  
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    
    return year+"-"+month+"-"+day;
}

