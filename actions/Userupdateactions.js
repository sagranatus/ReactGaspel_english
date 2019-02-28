
export const updateUser = (loginId, name, email, christ_name, age, region, cathedral) => {
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
        email: email,
        christ_name: christ_name,
        age: age,
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
