# Cueserver

Get a synchronized visual cue in your browser on a specific point in time.

Install node.js and NPM

Then run:
```
npm install
npm start
```

List options:
```
node cueserver.js --help
```

Open your browser at http://localhost:8080

## In SuperCollider:
```
n = NetAddr("localhost", 5004);
```
Mark first beat in the beat counter 2 seconds from now:

```
n.sendBundle(2.0, ["/beat", "all", 0]);
```

Blue cue with text 2 seconds from now:
```
n.sendBundle(2.0, ["/cue", "all", "blue", "both", "text"]);
```

Send red bar cue only to foo, coming from top (you must log in as foo: http://localhost:8080/cueserver.html?n=foo):
```
n.sendBundle(2.0, ["/cue", "foo", "red", "top", "bar"]);
```
From bottom:
```
n.sendBundle(2.0, ["/cue", "foo", "red", "bottom", "bar"]);
```

Message to everyone:
```
n.sendBundle(2.0, ["/text", "all", "message"]);
```

Register your SuperCollider app to receive OSC-messages from the cueserver (already registered in the default config file with localhost:57120, so you risk getting double OSC-messages):
```
n.sendMsg("/register");
```

Send a ping:

```
~id = UniqueID.next;

OSCFunc({arg msg, time, addr, recv_port;
	var id_received;
	id_received = msg[1];
	
	if (id_received == ~id) {
		"Success".postln;
	};
	
}, \pingreply, n).oneShot;

n.sendMsg("/ping", ~id);
```

Receive a button click:
```
OSCFunc({arg msg, time, addr, recvPort;
	msg[1..].postln;
}, "/buttonclick", n);
```

Check who is logged in (refresh your browser after registering the OSCFunc):
```
OSCFunc({arg msg, time, addr, recvPort;
	var clients;
	clients = msg[1..];
	clients.postln;
}, "/clients", n);
```
