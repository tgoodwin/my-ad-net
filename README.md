# admap
internet ad geolocation API for ad-blocking DNS servers

raspberry pi running pi-hole DNS server.

ad-map is an API that watches an ad-blocking DNS server's query logfile for blacklisted advertisement domains. ad-map parses the streaming logfile for ad-hosting domain names (domain name queries blocked by the pi-hole) and hits an IP address geolocation database with the blocked hostname.
