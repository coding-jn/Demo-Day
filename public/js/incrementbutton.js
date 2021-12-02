$(document).ready(function(){

    var quantitiy=0;
       $('#monetaryDonationsBudget-plus-btn').click(function(e){
            
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var quantity = parseInt($('#monetaryDonationsBudget_qty_input').val());
            
            // If is not undefined
                
                $('#monetaryDonationsBudget_qty_input').val(quantity + 1);
    
              
                // Increment
            
        });
    
         $('#monetaryDonationsBudget-minus-btn').click(function(e){
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var quantity = parseInt($('#monetaryDonationsBudget_qty_input').val());
            
            // If is not undefined
          
                // Increment
                if(quantity>0){
                $('#monetaryDonationsBudget_qty_input').val(quantity - 1);
                }
        });
        
    });

$(document).ready(function(){
    var quantitiy=0;
       $('#randomActsBudget-plus-btn').click(function(e){
            
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var quantity = parseInt($('#randomActsBudget_qty_input').val());
            
            // If is not undefined
                
                $('#randomActsBudget_qty_input').val(quantity + 1);
    
              
                // Increment
            
        });
    
         $('#randomActsBudget-minus-btn').click(function(e){
            // Stop acting like a button
            e.preventDefault();
            // Get the field name
            var quantity = parseInt($('#randomActsBudget_qty_input').val());
            
            // If is not undefined
          
                // Increment
                if(quantity>0){
                $('#randomActsBudget_qty_input').val(quantity - 1);
                }
        });
        
    });