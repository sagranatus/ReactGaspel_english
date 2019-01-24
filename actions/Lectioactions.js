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
      type: 'GETGASPEL_LECTIO',
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
        type: 'GETTHREEGASPEL_LECTIO',
        payload: req.then((response) => response.json())
      };
      return action;
    };

  

export const insertLectio = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) => { 
  console.log("message", "insert"+onesentence)
  req = fetch('https://sssagranatus.cafe24.com/servertest/lectioData.php', {
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
  console.log("message", "update"+onesentence)
  req = fetch('https://sssagranatus.cafe24.com/servertest/lectioData.php', {
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

