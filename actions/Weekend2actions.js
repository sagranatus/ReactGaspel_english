export const getGaspel = (date) => { 
console.log("Weekend2actions : ", "getGaspel")
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
      type: 'GETGASPEL_WEEKEND2',
      payload: req.then((response) => response.json())
    };
    return action;
  };
  
  export const getWeekendMore = (date) => { 
    console.log("Weekendactions2 : ", "getWeekendMore")
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
        type: 'GET_WEEKEND_MORE2',
        payload: req.then((response) => response.json())
      };
      return action;
    };
  
export const getThreeGaspel = (status, person, chapter, verse) => { 
  console.log("Weekend2actions : ", "get three gaspels")
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
        type: 'GETTHREEGASPEL_WEEKEND2',
        payload: req.then((response) => response.json())
      };
      return action;
    };

  

export const insertWeekend = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, mysentence, mythought,question, answer) => { 
  console.log("Weekend2actions : ", "inserted")
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

  req2 = fetch('https://sssagranatus.cafe24.com/servertest/weekendData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
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
        type: 'INSERTWEEKEND2',
        payload: req.then((response) => response.json()),
        payload2: req2.then((response) => response.json())
      };
      return action;
    };

export const updateWeekend = (status, id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, mysentence, mythought, question,answer) => { 
  console.log("Weekend2actions : ", "updated")
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

  req2 = fetch('https://sssagranatus.cafe24.com/servertest/weekendData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
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
        type: 'UPDATEWEEKEND2',
        payload: req.then((response) => response.json()),
        payload2: req2.then((response) => response.json())
      };
      return action;
    };

