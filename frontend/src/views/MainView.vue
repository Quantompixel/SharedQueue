<template>
  <div class="row">
    <div class="col-1">
      <button class="btn btn-secondary button" @click="add">Add</button>
    </div>

    <div class="col-7">
      <h3>Draggable {{ draggingInfo }}</h3>

      <draggable
          tag="ul"
          :list="list"
          class="list-group"
          handle=".handle"
          item-key="name"
          ghost-class="ghost"
          @end="endDrag"
      >
        <template #item="{ element, index }">
          <li class="list-item" @mousedown="updateDraggedElementID(element.id)">
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
                <path d="M160-390v-60h640v60H160Zm0-120v-60h640v60H160Z"/>
              </svg>
            </div>

            <div class="content">{{ element.title }}</div>

            <div class="close" @click="removeAt(index)">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
                <path
                    d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
              </svg>
            </div>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
let id = 3;
import draggable from "vuedraggable";

export default {
  name: "MainView",
  display: "Handle",
  instruction: "Drag using the handle icon",
  order: 5,
  components: {
    draggable
  },
  data() {
    return {
      list: [],
      dragging: false,
      socket: {},
      draggedElementID: {}
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    updateDraggedElementID(id) {
      this.draggedElementID = id;
    },
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function () {
      id++;
      this.list.push({name: "Juan " + id, id, text: ""});
    },
    endDrag() {
      this.reorderRequest()
    },
    reorderRequest() {
      for (let [index, item] of this.list.entries()) {
        if (item.id === this.draggedElementID) {
          let song = item.id;
          let before;
          let reference;

          if (index === 0) {
            before = true;
            reference = this.list[1].id;
          } else {
            before = false;
            reference = this.list[index - 1].id;
          }

          const messageData = {
            command: "reorder",
            params: {
              song: song,
              reference: reference,
              before: before
            }
          };

          this.socket.send(JSON.stringify(messageData));
          console.log(messageData);
        }
      }
    },
    getQueue() {
      const messageData = {
        command: "getQueue"
      };
      // Send the message data to the server using WebSockets
      this.socket.send(JSON.stringify(messageData))
    }
  },
  watch: {
    list: {
      handler(newValue) {
        console.log(newValue);
      },
      deep: true
    }
  },
  async mounted() {
    const sessionKey = sessionStorage.getItem("sessionKey");
    this.socket = await new WebSocket('ws://localhost:4111/?session_key=' + sessionKey);

    this.socket.onopen = () => this.getQueue();

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);

        if (!Object.keys(message).includes("type")) {
          throw new Error("wrong format");
        }

        if (message["type"] === "response") {
          if (message["command"] === "getQueue") {
            this.list = message.data;
          }
          if (message["command"] === "reorder") {
            // this.list = message.data;
            console.log("reorder response: ", message.data);
          }
        }
        if (message["type"] === "update") {
          this.list = message.data;
        }
      } catch (err) {
        console.log(err);
      }
    };
  }
};
</script>
<style scoped>
ul {
  list-style-type: none;
}

li {
  display: flex;
  width: 300px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid silver;
}

.handle {
  cursor: pointer;
}

.ghost {
  background: lightblue;
}
</style>