export const getGaspel = (date) => { 
  console.log("Weekendactions : ", "getGaspel")
req = fetch('https://sssagranatus.cafe24.com/servertest/get_gaspel.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    date: date
  }) 
})
 
    const action = {
      type: 'GETGASPEL_WEEKEND',
      payload: req.then((response) => response.json())
    };
    return action;
  };

  export const getWeekendMore = (date) => { 
    console.log("Weekendactions : ", "getWeekendMore")
  req = fetch('https://sssagranatus.cafe24.com/servertest/get_weekend_more.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      date: date
    }) 
  })
   
      const action = {
        type: 'GET_WEEKEND_MORE',
        payload: req.then((response) => response.json())
      };
      return action;
    };
  

export const getThreeGaspel = (status, person, chapter, verse) => { 
  console.log("Weekendactions : ", "get three gaspels")
  req = fetch('https://sssagranatus.cafe24.com/servertest/get_three_gaspel.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: status,
      person: person,
      chapter: chapter,
      verse: verse
    }) 
  })
    
      const action = {
        type: 'GETTHREEGASPEL_WEEKEND',
        payload: req.then((response) => response.json())
      };
      return action;
    };

  

export const insertWeekend = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, mysentence, mythought, question, answer) => { 
  console.log("Weekendactions : ", "inserted")
  var year = date.substring(0,4)
  console.log("year", year)
  req = fetch('https://sssagranatus.cafe24.com/servertest/lectioData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year: year,
      status: status,
      id: id,
      date: date,
      onesentence: onesentence,
      bg1: bg1,
      bg2: bg2,
      bg3: bg3,
      sum1: sum1,
      sum2: sum2,
      js1: js1,
      js2: js2

    }) 
  })

  req2 = fetch('https://sssagranatus.cafe24.com/servertest/weekendData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year: year,
      status: status,
      id: id,
      date: date,
      mysentence : mysentence,
      mythought: mythought,
      question: question,
      answer: answer
    }) 
  })
    
      const action = {
        type: 'INSERTWEEKEND',
        payload: req.then((response) => response.json()),
        payload2: req2.then((response) => response.json())
      };
      return action;
    };

export const updateWeekend = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, mysentence, mythought, question, answer) => { 
  var year = date.substring(0,4)
  console.log("year", year)
  console.log("Weekendactions : ", "updated")
  req = fetch('https://sssagranatus.cafe24.com/servertest/lectioData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year: year,
      status: status,
      id: id,
      date: date,
      onesentence: onesentence,
      bg1: bg1,
      bg2: bg2,
      bg3: bg3,
      sum1: sum1,
      sum2: sum2,
      js1: js1,
      js2: js2
    }) 
  })

  req2 = fetch('https://sssagranatus.cafe24.com/servertest/weekendData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year: year,
      status: status,
      id: id,
      date: date,
      mysentence : mysentence,
      mythought: mythought,
      question: question,
      answer: answer
    }) 
  })
    
      const action = {
        type: 'UPDATEWEEKEND',
        payload: req.then((response) => response.json()),
        payload2: req2.then((response) => response.json())
      };
      return action;
    };

