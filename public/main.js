
var today = document.getElementsByClassName('today')

document.getElementById('calendar_content').addEventListener('click',  function(e){
  const status = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[13].value
    if (e.target.className === 'today' && status != "complete"){
        const goalId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[7].value
        const charityGoal = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[1].value
        const cost = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[9].value
        const action = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[11].value
        const monetaryDonationsBudget = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[3].value
        const randomActsBudget = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[3].childNodes[5].value
        fetch('goals', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'goalId': goalId,
            'cost': cost,
            'action': action,
            'monetaryDonationsBudget': monetaryDonationsBudget,
            'randomActsBudget': randomActsBudget
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
        fetch('questionare', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'from': 'calendar',
              'cost': cost,
              'action': action,
              'charityGoal': charityGoal,
              'monetaryDonationsBudget': monetaryDonationsBudget,
              'randomActsBudget': randomActsBudget
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            window.location.reload(true)
          })
    }
});

