// gaspel2는 calendar에서 다른 날짜로 이동시에 Main2_2에 대한 action이다.

export const getGaspel = (date) => { 
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
      type: 'GETGASPEL2',
      payload: req.then((response) => response.json())
    };
    return action;
  };
  

export const getThreeGaspel = (status, person, chapter, verse) => { 
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
        type: 'GETTHREEGASPEL2',
        payload: req.then((response) => response.json())
      };
      return action;
    };

 

export const insertComment = (status, id, date, onesentence, comment) => { 
  console.log("message", "insert"+onesentence)
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
        type: 'INSERTCOMMENT2',
        payload: req.then((response) => response.json())
      };
      return action;
    };

export const updateComment = (status, id, date, onesentence, comment) => { 
  console.log("message", "update"+onesentence)
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
        type: 'UPDATECOMMENT2',
        payload: req.then((response) => response.json())
      };
      return action;
    };

