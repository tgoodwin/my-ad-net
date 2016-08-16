# admap
an ad server geolocation tool that works with the [pi-hole](https://github.com/pi-hole/pi-hole) DNS server.

*my-ad-net* is a lightweight server that listens to a DNS server's logfile for blacklisted ad server domains and returns geospatial data. Using the pi-hole DNS server as example, *my-ad-net* reads the DNS queries for the advertisement hostnames blocked by pi-hole, and then hits an IP geolocation database with addresses of the blocked domains. Geolocation is done in realtime as pi-hole handles DNS queries before forwarding queries to an external DNS server. Advertisement server location info, as well as some statistics, can be accessed through the server's various `GET` endpoints.

The server also supplies a visual interactive experience that will display location of all ad queries detected, as well as ongoing statistics, in realtime (as you browse!). This map can be viewed in the browser at the server's address on port `8080`.

For realtime ad reporting, *my-ad-net* should be installed and run on the same instance as the local DNS server.

For example, if you have a local DNS server connected to your router, and its local address is 192.168.1.10, all geospatial ad info can be easily viewed at `192.168.1.10:8080`.

