

class PoloniexConnector {
  constructor() {
    super();

    this.connection = new autobahn.Connection({
      var wsuri = "wss://api.poloniex.com";
        url: wsuri,
        realm: "realm1"
      });

      this.connection.onclose = this.onclose;
      this.connection.onopen = this.onopen;
  }

  open() {
    super.open();
  }
  close() {
    super.close();
  }
  onopen() {
    super.onopen();
  }
  onclose(reason, details) {
    super.onclose();

    if (reason === "unreachable") {
      console.log(`Unable to establish connection (retry no: ${details.retry_count})`);
    } else if (reason === "lost") {
      console.log("Connection Lost");
    } else if (reason === "closed") {
      console.log("Websocket connection closed");
      if (details.message) {
        console.log(`Message: ${details.message}`);
      }
    } else if (reason === "unsupported") {
      console.log("Websocket connection not supported");
    } else {
      console.log("Connection Closed: Unknown Reason");
    }
  }
}
