export const getGaspel = (date) => { 
  console.log("Lectioactions : ", "getGaspel")
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
      type: 'GETGASPEL_LECTIO',
      payload: req.then((response) => response.json())
    };
    return action;
  };
  

export const getThreeGaspel = (status, person, chapter, verse) => { 
  console.log("Lectioactions : ", "get three gaspels")
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
        type: 'GETTHREEGASPEL_LECTIO',
        payload: req.then((response) => response.json())
      };
      return action;
    };

  

export const insertLectio = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) => { 
  console.log("Lectioactions : ", "inserted")
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
    
      const action = {
        type: 'INSERTLECTIO',
        payload: req.then((response) => response.json())
      };
      return action;
    };

export const updateLectio = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) => { 
  console.log("Lectioactions : ", "updated")
  var year = date.substring(0,4)
  console.log("year", year)
  req = fetch('https://sssagranatus.cafe24.com/servertest/lectioData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year:year,
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
    
      const action = {
        type: 'UPDATELECTIO',
        payload: req.then((response) => response.json())
      };
      return action;
    };


    

export const insertComment = (status, id, date, onesentence, comment) => { 
  var year = date.substring(0,4)
  console.log("year", year)
  console.log("Gaspelactions : ", "inserted")
  req = fetch('https://sssagranatus.cafe24.com/servertest/commentData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year:year,
      status: status,
      id: id,
      date: date,
      onesentence: onesentence,
      comment: comment
    }) 
  })
    
      const action = {
        type: 'INSERTCOMMENT',
        payload: req.then((response) => response.json())
      };
      return action;
    };

export const updateComment = (status, id, date, onesentence, comment) => { 
  var year = date.substring(0,4)
  console.log("year", year)
  console.log("Gaspelactions : ", "updated")
  req = fetch('https://sssagranatus.cafe24.com/servertest/commentData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      year:year,
      status: status,
      id: id,
      date: date,
      onesentence: onesentence,
      comment: comment
    }) 
  })
    
      const action = {
        type: 'UPDATECOMMENT',
        payload: req.then((response) => response.json())
      };
      return action;
    };

