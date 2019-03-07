
export const updateUser = (loginId, name, user_id, christ_name, age, gender, region, cathedral) => {
    console.log("Update") 
    req = fetch('https://sssagranatus.cafe24.com/servertest/user_update.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: loginId,
        name: name,
        user_id: user_id,
        christ_name: christ_name,
        age: age,
        gender: gender,
        region: region,
        cathedral: cathedral
      }) 
    })
  
    const action = {
      type: 'UPDATEUSER',
      payload: req.then((response) => response.json())
    };
    return action;
  };
