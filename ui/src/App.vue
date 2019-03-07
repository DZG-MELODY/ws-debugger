<template>
  <div id="app">
    <div id="leftDiv">
      <el-alert
        v-bind:title="netStatus.message"
        center
        v-bind:type="netStatus.type"
        :closable="false"
        show-icon
      ></el-alert>
      <el-input
        type="textarea"
        :autosize="{ minRows: 26, maxRows: 60}"
        placeholder="请输入要发送的mock数据"
        v-model="params"
      ></el-input>
      <el-button id="sendButton" type="danger" v-on:click="clearTextArea">clear</el-button>
      <el-button id="sendButton" type="success" v-on:click="sendMockMsg">send</el-button>
    </div>
    <div id="rightDiv">
      <p>recently mock historys</p>
      <el-table v-bind:data="msgLogs" v-bind:show-header="false" style="width: 100%">
        <el-table-column
          align="left"
          prop="message"
          label="message"
          v-bind:show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column align="right" prop="copy" label="copy">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              v-bind:content="scope.row.message"
              placement="top-start"
            >
              <el-button v-clipboard:copy="scope.row.message">copy</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      message: "",
      msgLogs: [],
      params: "",
      ws: new WebSocket("ws://127.0.0.1:8080"),
      netStatus: {
        type: "info",
        message: "尚未连接server"
      }
    };
  },
  mounted() {
    this.ws.addEventListener("open", evt => {
      this.ws.send(
        JSON.stringify({
          type: "init",
          id: document.location.host
        })
      );
    });
    this.ws.addEventListener("message", evt => {
      let receivedData = "";
      try {
        receivedData = JSON.parse(evt.data);
      } catch (error) {
        receivedData = evt.data;
      }
      receivedData.type == "init" &&
        (this.netStatus.message = receivedData.message) &&
        (this.netStatus.type = "success");
      receivedData.type == "send" &&
        (this.msgLogs = this.handleMsgLogs(receivedData.msgLogs));
    });
  },
  beforeDestroy() {
    this.ws.close();
  },
  methods: {
    sendMockMsg() {
      try {
        this.params = JSON.parse(this.params);
      } catch (error) {
        this.$message.error("数据格式有误，无法解析");
        return false;
      }
      this.ws.send(
        JSON.stringify({
          type: "send",
          id: document.location.host,
          message: this.params
        })
      );
    },
    clearTextArea() {
      this.params = "";
    },
    handleMsgLogs(arr) {
      const result = [];
      for (const item of arr) {
        result.push({ message: JSON.stringify(item) });
      }
      return result;
    }
  }
};
</script>

<style>
#app {
  display: flex;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 70%;
}
#app #sendButton {
  margin-top: 11px;
  margin-left: 0px;
  font-size: 15px;
  width: 50%;
}
#app #rightDiv {
  width: 50%;
}
#app #leftDiv {
  width: 50%;
}
#app p {
  text-align: center;
  margin: 0;
  height: 38px;
  line-height: 38px;
}
#app .el-table td {
  padding: 10px 0px !important;
}
</style>
