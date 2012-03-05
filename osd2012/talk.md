# TODO
- remove where-slide

# Presentation

JavaScript is an ubiquitous somewhat functional asynchronous dynamic scripting language with prototypal object model and quirks. 



Ubiquitous
- it is everywhere.

That is also what 
make the language
so interesting.

JavaScript is the most easy way
to deploy applications on mobile phones

it is the language that is in most web browsers

tons of different applications
are using it to be scripted

it runs very well for server tasks

and it even is in some embedded systems.



Somewhat functional,
- I like functional programming,
it is fun.

JavaScript is better than most
industrial languages
and scripting languages as well.

As it got functions right.
Not only are they first class values,
and it also supports anonymous functions,
but it got closures right,

which has become _the_ major abstraction
in the language.

It is only _somewhat_ functional,
as its data structures are mutable.
It does not have a natural
data structure for immutable list processing.



Asynchronous,
a lot of the engines
does not support
multiple threads

This is not as big an issue
as you might expect.

A lot of the libraries are asynchronous
so when you are reading a file, waiting for a timeout,
or writing to the network,
the execution is not blocked,
but instead you just
pass a callback
to the readfile or timeout function.
And this will then be called when the desired action has finished.

This actually performes well
as long as the application
is not cpu-bound.

Cpu-heavy applications
must yield to stay responsive,
but on the other hand
we are released from locks.



Dynamic means that 
types are resolved at runtime.

This means less toolability,
and that errors are not caught at compiletime.
This is a trade-off against stability 
for rapid prototyping.



Scripting language

regular expressions are a part of the language
and hashmap is the usual datastructure



prototypal inheritance
