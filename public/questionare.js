
var charityGoals = document.getElementsByName('charityGoal')

document.getElementById('update').addEventListener('click', function updateForm(){
    for(i = 0; i < charityGoals.length; i++) {
        if(charityGoals[i].checked){
        var charityGoal = charityGoals[i].value
       }
    }
      const monetaryDonationsBudget = document.getElementById('monetaryDonationsBudget_qty_input').value
      const randomActsBudget = document.getElementById('randomActsBudget_qty_input').value
      if(monetaryDonationsBudget > 0 && randomActsBudget > 0){
      fetch('questionare', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'charityGoal': charityGoal,
          'monetaryDonationsBudget': monetaryDonationsBudget,
          'randomActsBudget': randomActsBudget
        })
      }).then(function (response) {
        window.location.reload()
      })
    }else{
        return
    }
});


