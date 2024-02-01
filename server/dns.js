const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.slm.dlakl.mongodb.net", (err, addresses) => {
  if (err) {
    console.error("DNS resolution error:", err);
  } else {
    console.log("Resolved addresses:", addresses);
  }
});
