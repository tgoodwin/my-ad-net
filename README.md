# admap
an ad geolocation API for the [pi-hole](https://github.com/pi-hole/pi-hole) DNS server software, commonly run on raspberry pi over local area networks.


*admap* is a lightweight server that listens to an DNS server's logfile for blacklisted advertisement domains. ad-map completes the DNS queries for the advertisement hostnames blocked by pi-hole, and then hits an IP geolocation database with addresses of the blocked domains. Geolocation is done in realtime as pi-hole handles DNS queries. Advertisement server location info is exposed via a RESTful API.
