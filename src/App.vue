<template>
<div :class="['loader', loading == false ? 'd-none' : '']">
  <div class="lds-ripple"><div></div><div></div></div>
</div>
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
        <div class="col-10 position-relative">
          <input
            v-model="new_item.name"
            class="form-control"
            type="text"
            placeholder="Item Name"
            required
            minlength="4"
          />
        </div>
        <div class="col-1 p-0 m-0">
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

      <div class="row mt-3 itemsList">
        <div
          v-for="(i, k) of items"
          :key="k"
          class="row"
          draggable="true"
          @dragstart="startDrag($event, k)"
          @drop="onDrop($event, k)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div class="col-1">
            <!-- <label :for="i.id" class="state-label"> -->
            <input
              :id="i.id"
              type="checkbox"
              :checked="i.state == 'completed' ? true : false"
              @change="changeState(k)"
            />
            <!-- </label> -->
          </div>
          <div class="col-10">
            <label
              :for="i.id"
              :class="[
                'btn',
                'p-0',
                'm-0',
                i.state == 'completed' ? 'completed' : '',
              ]"
            >
              {{ i.name }}
            </label>
          </div>
          <div class="col-1 p-0 m-0">
            <button class="btn p-0 m-0" type="button" @click="deleteItem(i.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path
                  fill="#494C6B"
                  fill-rule="evenodd"
                  d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="row position-relative footer">
          <div class="col-lg-3 col-6 order-1 text-start">
            <p style="margin: auto">
              {{ filter == 'completed items' ? items.length + ' completed' : items.filter((item) => item.state == "active").length + ' items left'}} 
            </p>
          </div>
          <div class="filterOpts first_row col-lg-5 col-12 order-lg-2 order-3">
            <div class="filterOpt">
              <input
                name="filter"
                v-model="filter"
                type="radio"
                value="all"
                id="filterAll"
              />
              <label for="filterAll"> All </label>
            </div>
            <div class="filterOpt">
              <input
                name="filter"
                v-model="filter"
                type="radio"
                value="active"
                id="filterActive"
              />
              <label for="filterActive"> Active </label>
            </div>
            <div class="filterOpt">
              <input
                name="filter"
                v-model="filter"
                type="radio"
                value="completed"
                id="filterCompleted"
              />
              <label for="filterCompleted"> Completed </label>
            </div>
          </div>
          <div class="col-lg-4 col-6 order-lg-3 order-2 text-end">
            <button
              class="btn btn-clear p-0 m-0"
              type="button"
              @click="clearCompleted()"
            >
              Clear Completed
            </button>
          </div>
        </div>

      </div>
      <p class="footnote">
          Drag and drop to reorder list
        </p>
    </div>
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
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "./db";

export default {
  name: "App",
  components: {},
  data() {
    return {
      publicPath: process.env.BASE_URL,
      items: [],
      new_item: { name: null, state: false },
      filter: "all",
      themeDark: true,
      loading: true,
      editing: false
    };
  },
  created() {
    this.changeTheme();
    this.getAllItems()
  },
  watch: {
    themeDark() {
      this.changeTheme();
    },
    filter() {
      this.getFilteredItems();
    },
  },
  methods: {
    async getAllItems() {
      this.loading = true
      onSnapshot(
        query(collection(db, "items"), orderBy("position")),
        (snap) => {
          this.items = [];
          this.filter = 'all'
          snap.forEach((doc) => {
            this.items.push(doc.data());
            this.items[this.items.length - 1].id = doc.id;
          });
          
          this.loading = this.editing == true ? true : false
        }
      );
    },
    async getFilteredItems() {
      if (this.filter == "all") {
        this.getAllItems();
      } else {
        this.loading = true
        let its = await getDocs(query(
          collection(db, "items"),
          where("state", "==", this.filter),
          orderBy("position")
        ));
        
        this.items = [];
        its.forEach((doc) => {
          this.items.push(doc.data());
          this.items[this.items.length - 1].id = doc.id;
        });
        this.loading = false
      }
    },
    async addItem() {
      if (this.new_item.name !== "" && this.new_item.name.length > 0) {
        this.loading = true
        this.editing = true
        await addDoc(collection(db, "items"), {
          name: this.new_item.name,
          state: this.new_item.state == false ? "active" : "completed",
          position: this.items.length,
        })
          .then(() => {
            this.new_item.name = null
            this.new_item.state = false
            this.loading = false
            this.editing = false
          })
          .catch((error) => {
            console.log("could not add item: " + error);
            this.loading = false
          });


      }
    },
    async changeState(id) {
      this.loading = true
      await updateDoc(doc(db, "items", this.items[id].id), {
        state: this.items[id].state == "completed" ? "active" : "completed",
      })
        .then(() => {this.loading = false})
        .catch((error) => {
          console.log("could not updated item: " + error);
          this.loading = false
        });
    },
    async changeOrder(id, newPosition) {
      this.loading = true
      await updateDoc(doc(db, "items", this.items[id].id), {
        position: newPosition,
      })
        .then(() => {this.loading = false})
        .catch((error) => {
          console.log("could not updated item: " + error);
          this.loading = false
        });
    },
    async deleteItem(id) {
      this.loading = true
      await deleteDoc(doc(db, "items", id))
        .then(() => {this.loading = false})
        .catch((error) => {
          console.log("Could not Delete Item: " + error);
          this.loading = false
        });
    },
    async clearCompleted() {
      this.loading = true
      let cItems = this.items.filter((i) => i.state == "completed");
      cItems.forEach((i) => {
        deleteDoc(doc(db, "items", i.id)).catch((error) => {
          console.log("could not delete item <" + i.name + ">: " + error);
        });
      });
      this.loading = false
    },
    changeTheme() {
      if (this.themeDark == 1) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
    startDrag(evt, k) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("itemIndex", k);
    },
    onDrop(evt, itemRIndex) {
      const itemIndex = evt.dataTransfer.getData("itemIndex");
      let temp = this.items[itemIndex].position;
      this.changeOrder(itemIndex, this.items[itemRIndex].position).catch(
        (error) => {
          console.log(
            "Could not change order of item <" +
              this.items[itemIndex].name +
              ">: " +
              error
          );
        }
      );
      this.changeOrder(itemRIndex, temp).catch((error) => {
        console.log(
          "Could not change order of item <" +
            this.items[itemRIndex].name +
            ">: " +
            error
        );
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

html body {
  font-family: "Josefin Sans", sans-serif !important;
  background: url("/public/bg-mobile-light.jpg"), #f8f8f8;
  background-repeat: no-repeat !important;
  background-size: 100% !important;

  color: hsl(235, 19%, 35%);
}
body.dark {
  background: url("/public/bg-mobile-dark.jpg"), #171723;
  color: hsl(234, 39%, 85%);
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
  border-radius: 5px;
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
.itemsList .row {
  padding: 1em !important;
  align-items: center;
  justify-content: center;
  margin: 0;
  text-align: start;
}
.itemsList .row:not(:last-child) {
  border-bottom: 1px solid #e6e5ea;
}
.row .col-10 {
  padding-left: 1em;
  padding-right: 1em;
}
.dark .itemsList .row:not(:last-child) {
  border-bottom-color: #383a4f;
}
label.btn {
  color: inherit;
  width: 100%;
  text-align: start;
}

.dark label.completed {
  color: #494b62;
}
label.completed {
  color: #dadadc;
  text-decoration: line-through;
}
label.btn:focus,
label.btn:active {
  border: none;
}
.footer,
.footer .btn, .footnote {
  font-size: 14px;
  color: hsl(236, 9%, 61%);
}
.dark .footer,
.dark .footer .btn, .dark .footnote {
  color: #494b62;
}
.filterOpts {
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  bottom: -4.5em;
}
.filterOpt input[type="radio"] {
  appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  -webkit-appearance: none;
}
.filterOpt input[type="radio"] + label {
  cursor: pointer;
  font-weight: 700;
}
.filterOpt input[type="radio"]:checked + label {
  color: hsl(220, 98%, 61%);
}
.btn-clear:hover,
.btn-clear:focus,
.filterOpt input[type="radio"]:hover + label,
.filterOpt input[type="radio"]:focus + label {
  color: hsl(235, 19%, 35%) !important;
}
.dark .btn-clear:hover,
.btn-clear:focus,
.dark .filterOpt input[type="radio"]:hover + label,
.dark .filterOpt input[type="radio"]:focus + label {
  color: hsl(234, 39%, 85%) !important;
}

.footnote {
  font-size: 14px;
  margin-top: 2em;
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
  .filterOpts {
    position: unset;
  }
}
.loader {
  height: 100vh;
display: flex;
justify-content: center;
align-items: center;
position: fixed;
width: 100%;
background: #f8f8f8c0;
z-index: 100;
}
.dark .loader {
  background: #171723c0;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #171723;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.dark .lds-ripple div {
  border-color: #f8f8f8;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

</style>
