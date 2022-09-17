<template>
  <div class="container col-lg-6 pt-5 p-3">
    <nav class="navbar bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">Todo</a>

        <button class="d-flex btn btn-outline-success" type="button">
          Search
        </button>
      </div>
    </nav>
    <div class="form-group m-3">
      <input
        v-model="new_item"
        class="form-control mb-1"
        type="text"
        placeholder="Item Name"
      />
    </div>
    <ul class="d-block m-3">
      <li v-for="(i, k) of items" :key="k" class="m-3">
        {{ i.name }} - {{ i.state }} - {{ i.id }} - {{ i.position }}
        <button
          v-if="i.state == 'active'"
          class="btn btn-secondary"
          @click="changeState(i.id)"
        >
          complete
        </button>
        <button class="btn btn-danger" @click="deleteItem(i.id)">delete</button>
      </li>
    </ul>
    <select v-model="filter" @change="getAllItems()">
      <option value="all" default>All</option>
      <option value="completed">Completed</option>
      <option value="active">Active</option>
    </select>
    <button class="btn btn-danger" @click="clearCompleted()">
      Clear Completed
    </button>
  </div>
</template>

<script>
import {
  query,
  collection,
  addDoc,
  updateDoc,
  doc,
  where,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./db";

export default {
  name: "App",
  components: {},
  data() {
    return {
      publicPath: process.env.BASE_URL,
      items: [],
      new_item: "",
      filter: "all",
    };
  },
  created() {
    this.getAllItems();
  },
  methods: {
    async getAllItems() {
      let op = "in";
      let f = ["completed", "active"];
      if (this.filter != "all") {
        op = "==";
        f = this.filter;
      }
      onSnapshot(
        query(collection(db, "items"), where("state", op, f)),
        (snap) => {
          this.items = [];
          snap.forEach((doc) => {
            this.items.push(doc.data());
            this.items[this.items.length - 1].id = doc.id;
          });
        }
      );
    },
    async addItem() {
      if (this.new_item !== "" && this.new_item.length > 0) {
        await addDoc(collection(db, "items"), {
          name: this.new_item,
          state: "active",
          position: this.items.length,
        })
          .then(() => {})
          .catch((error) => {
            console.log("could not add item: " + error);
          });
      }
    },
    async changeState(id) {
      await updateDoc(doc(db, "items", id), { state: "completed" })
        .then(() => {})
        .catch((error) => {
          console.log("could not updated item: " + error);
        });
    },
    async deleteItem(id) {
      await deleteDoc(doc(db, "items", id))
        .then(() => {})
        .catch((error) => {
          console.log("Could not Delete Item: " + error);
        });
    },
    async clearCompleted() {
      let cItems = this.items.filter((i) => i.state == "completed");
      cItems.forEach((i) => {
        deleteDoc(doc(db, "items", i.id)).catch((error) => {
          console.log("could not delete item <" + i.name + ">: " + error);
        });
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

body {
  font-family: "Josefin Sans", sans-serif !important;
}
</style>
