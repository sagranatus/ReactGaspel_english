export const getGaspel = (date) => { 
  console.log("Gaspelactions : ", "getGaspel")
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
      type: 'GETGASPEL',
      payload: req.then((response) => response.json())
    };
    return action;
  };
  

export const getThreeGaspel = (status, person, chapter, verse) => { 
  console.log("Gaspelactions : ", "get three gaspels")
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
        type: 'GETTHREEGASPEL',
        payload: req.then((response) => response.json())
      };
      return action;
    };

 
/*
export const insertComment = (status, id, date, onesentence, comment) => { 
  console.log("Gaspelactions : ", "inserted")
  req = fetch('https://sssagranatus.cafe24.com/servertest/commentData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
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
  console.log("Gaspelactions : ", "updated")
  req = fetch('https://sssagranatus.cafe24.com/servertest/commentData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
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

*/