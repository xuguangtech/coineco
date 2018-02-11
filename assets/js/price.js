$(document).ready(function() {
	$(".checkbox").change(function () {
		var sum = 0

		$(".checkbox input:checked").each(function(){
			sum += 0.05
		});

		$(".checkboxsum input").val(sum.toFixed(2));
	});
});
