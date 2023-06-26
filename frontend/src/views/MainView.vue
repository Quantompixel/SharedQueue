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
      >
        <template #item="{ element, index }">
          <li class="list-item">
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M160-390v-60h640v60H160Zm0-120v-60h640v60H160Z"/></svg>
            </div>

            <div class="content">{{ element.name }} </div>

            <div class="close" @click="removeAt(index)">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
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
      list: [
        { name: "John", text: "", id: 0 },
        { name: "Joao", text: "", id: 1 },
        { name: "Jean", text: "", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function() {
      id++;
      this.list.push({ name: "Juan " + id, id, text: "" });
    }
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