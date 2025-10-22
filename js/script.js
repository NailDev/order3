let jshover = function()
{
	let menuDiv = document.getElementById("horizontal-multilevel-menu")
	if (!menuDiv)
		return;

	let sfEls = menuDiv.getElementsByTagName("li");
	for (let i=0; i<sfEls.length; i++) 
	{
		sfEls[i].onmouseover=function()
		{
			this.className+=" jshover";
		}
		sfEls[i].onmouseout=function() 
		{
			this.className=this.className.replace(new RegExp(" jshover\\b"), "");
		}
	}
}

if (window.attachEvent) 
	window.attachEvent("onload", jshover);
