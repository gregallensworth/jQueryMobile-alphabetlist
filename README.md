alphabetlist

Greg Allensworth, gregor@greeninfo.org

A plugin for jQuery Mobile, to add an alphabet index down the right-hand side of the screen.
This is useful for lengthy listviews, allowing quick navigation without undue scrolling.

The performance is pretty decent, even with over 1000 elements in the listview.


REQUIREMENT / PREREQUISITE
=============

This uses jquery.viewport.js to determine whether there is a page header within scrolling.
You will need that loaded so the :in-viewport pseudo-selector works.


USAGE
=============

$('ul[data-role="listview"][data-alphabet="true"]').alphabetlist();

This creates an alphabetlist, and loads it from the LIs present in the ul listview.

For CSS purposes, the alphabetlist is:

ul[data-role="alphabetlist"]

listview.alphabetlist('refresh')

Re-generate the listview's correspnding alphabetlist. Useful if you have changed the data.

listview.alphabetlist('click','W')

Trigger a click on a specific letter.


LICENSE
=============

Free, open source, public. Knock yourself out. :)


TO-DO / BUGS / WISHES
=============

- On the iPad, silentScroll can have a flickering effect. I haven't figured
  out how to make it less flickery, but still have it instantly jump.

