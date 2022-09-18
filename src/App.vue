<template>
  <div class="container col-lg-6 mainContainer">
    <nav class="navbar">
      <div class="container-fluid p-0">
        <h1 class="navbar-brand">Todo</h1>

        <label class="d-flex btn-theme" id="themeBtn" type="button">
          <input
            type="checkbox"
            class="d-none"
            v-model="themeDark"
            aria-labelledby="#themeBtn"
          />
          <svg
            v-if="themeDark == true"
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
          >
            <path
              fill="#FFF"
              fill-rule="evenodd"
              d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="26" height="26">
            <path
              fill="#FFF"
              fill-rule="evenodd"
              d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
            />
          </svg>
        </label>
      </div>
    </nav>
    <div class="container-fluid items-table text-center">
      <div class="row first_row">
        <div class="col-1">
          <label for="#new_item_state" class="state-label">
            <input
              v-model="new_item.state"
              id="new_item_state"
              type="checkbox"
              name="state"
            />
            <!-- <span class="checkBox"></span> -->
          </label>
        </div>
        <div class="col-10">
          <input
            v-model="new_item.name"
            class="form-control"
            type="text"
            placeholder="Item Name"
            required
            minlength="4"
          />
        </div>
        <div class="col-1">
          <button class="btn p-0 m-0" type="button" @click="addItem()">
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
              width="18"
              height="18"
            >
              <path
                id="Layer"
                style="fill: #494c6b"
                class="s0"
                d="m8.6 0h0.8v8.6h8.6v0.8h-8.6v8.6h-0.8v-8.6h-8.6v-0.8h8.6c0 0 0-8.6 0-8.6zm0 0h0.8v8.6h8.6v0.8h-8.6v8.6h-0.8v-8.6h-8.6v-0.8h8.6c0 0 0-8.6 0-8.6z"
              />
            </svg>
          </button>
        </div>
      </div>
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
      new_item: { name: "", state: false },
      filter: "all",
      themeDark: true,
    };
  },
  created() {
    this.changeTheme();
    this.getAllItems();
  },
  watch: {
    themeDark() {
      this.changeTheme();
    },
    "new_item.state"(ol, nw) {
      console.log(ol, nw);
    },
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
      if (this.new_item.name !== "" && this.new_item.name.length > 0) {
        await addDoc(collection(db, "items"), {
          name: this.new_item.name,
          state: this.new_item.state == false ? "active" : "completed",
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
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

body {
  font-family: "Josefin Sans", sans-serif !important;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url("/public/bg-mobile-light.jpg");
  background-color: #f8f8f8;
  color: #656473;
}
body.dark {
  background-image: url("/public/bg-mobile-dark.jpg");
  background-color: #171723;
  color: #a9abc2;
}

nav h1.navbar-brand,
nav h1.navbar-brand:hover {
  font-size: calc(1em + 1.5vw);
  color: #fff;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 15px;
  padding: 0;
  margin: 0;
}

div.items-table {
  margin-top: 1.5em;
}

.first_row {
  padding: 1em;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}
input {
  color: inherit !important;
}
.dark .first_row,
.dark .itemsList {
  background-color: #25273c;
}
.first_row,
.itemsList {
  background-color: #fff;
}
input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  display: grid;
  place-content: center;
}
input[type="checkbox"]::before {
  width: 25px;
  height: 25px;
  display: inline-block;
  border: #f0f0f1 2px solid;
  border-radius: 50%;
  content: "";
}
.dark input[type="checkbox"]::before {
  border-color: #2f3146;
}
input[type="checkbox"]:checked::before,
input[type="checkbox"]:checked:hover::before,
input[type="checkbox"]:checked:focus::before,
input[type="checkbox"]:checked:focus-visible::before {
  background: url("/public/icon-check.svg"),
    linear-gradient(-45deg, #80c9fc, #a47cdf);
  background-repeat: no-repeat;
  background-position: center center;
  -webkit-mask: none;
  -webkit-mask-composite: none; /*5'*/
  mask-composite: none;
  border: none;
}
input[type="checkbox"]:hover::before,
input[type="checkbox"]:focus-visible::before,
input[type="checkbox"]:focus::before {
  cursor: pointer;
  border: 2px solid transparent; /*2*/
  background: linear-gradient(-45deg, #80c9fc, #a47cdf) border-box; /*3*/
  -webkit-mask: /*4*/ linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; /*5'*/
  mask-composite: exclude;
}
input[type="checkbox"]:focus-visible {
  border: none;
  outline: 0;
}
label.state-label {
  display: flex;
  justify-content: center;
  align-items: center;
}
input[type="text"].form-control {
  background: none;
  border: none;
  padding: 0;
}
input[type="text"].form-control:hover,
input[type="text"].form-control:focus {
  border: none;
  box-shadow: none;
}
.container.mainContainer {
  padding-top: 2.5em !important;
  padding: 1.5em;
}
@media (min-width: 992px) {
  body {
    background-image: url("/public/bg-desktop-light.jpg");
  }
  body.dark {
    background-image: url("/public/bg-desktop-dark.jpg");
  }

  .container.mainContainer {
    padding: 5em;
    padding-top: 4em !important;
  }
}
</style>
