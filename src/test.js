var selectedItem = this.$(".selected"); 

if (selectedItem.length == 0)
return null; 
} else {
return selectedItem.data("view");
}


// The function below is used to make sure rounding differences don't cause the wrong status on accounts when dealing with refunds or credits close to zero.
// $amount is a float
function roundSmallAmountsToZero($amount) { 
    return ($amount < 0.01) ? 0 : $amount;
}

function updatePaid($quote){
if ($quote->paid_status_c == 'Paid' || $quote->paid_status_c == 'Part Paid' && roundSmallAmountsToZero($quote-
>amount_paid_c) == 0) 
} else { 
    $quote->paid_status_c = 'Not Paid';
}
if ($quote->paid_status_c == 'Not Paid' || $quote->paid_status_c == 'Part Paid' && roundSmallAmountsToZero($quote- >amount_outstanding_c) == 0)
} else {
$quote->paid_status_c = 'Paid'; }
}