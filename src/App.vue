<template>
  <div class="container col-lg-6 pt-5 p-3">
    <nav class="navbar">
      <div class="container-fluid">
        <h1 class="navbar-brand">Todo</h1>

        <label class="d-flex btn-theme" id="themeBtn" type="button">
          <input type="checkbox" class="d-none" v-model="themeDark" aria-labelledby="#themeBtn" >
          <svg v-if="themeDark == true" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>
        </label>
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
      themeDark: true
    };
  },
  created() {
    this.changeTheme()
    this.getAllItems();
  },
  watch: {
    themeDark() {
      this.changeTheme()
    }
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
    changeTheme() {
      if (this.themeDark == 1) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

body {
  font-family: "Josefin Sans", sans-serif !important;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url('/public/bg-mobile-light.jpg');
  background-color: #f8f8f8;


}
body.dark {
  background-image: url('/public/bg-mobile-dark.jpg');
  background-color: #171723;
}

@media (min-width:992px) {
  body {
    background-image: url('/public/bg-desktop-light.jpg');
  }
  body.dark {
  background-image: url('/public/bg-desktop-dark.jpg');
} 
}
</style>
