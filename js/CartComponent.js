Vue.component('cart', {
   data() {
      return {
         cartUrl: `/getBasket.json`,
         cartItems: [],
         showCart: false,
         imgCart: `https://placehold.it/50x100`
      }
   },
   methods: {
      addProduct(product) {
         this.$parent.getJson(`${API}/addToBasket.json`)
            .then(data => {
               if (data.result) {
                  let find = this.cartItems.find(el => el.id_product === product.id_product);
                  if (find) {
                     find.quantity++
                  } else {
                     let prod = Object.assign({
                        quantity: 1
                     }, product);
                     this.cartItems.push(prod);
                  }
               } else {
                  console.log('error!')
               }
            })
      },
      remove(product) {
         this.$parent.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
               if (data.result) {
                  if (product.quantity > 1) {
                     product.quantity--
                  } else {
                     this.cartItems.splice(this.cartItems.indexOf(product), 1);
                  }
               } else {
                  console.log('error!')
               }
            })
      },
   },
   mounted() {
      this.$parent.getJson(`${API + this.cartUrl}`)
         .then(data => {
            for (let el of data.contents) {
               this.cartItems.push(el);
            }
         });
   },
   template: `<div>
<button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
<div class="cart-block" v-show="showCart">
            <p v-if="!cartItems.length">Cart is empty</p>
            <cart-item 
            v-for="item of cartItems" 
            :key="item.id_product"
            :img="imgCart"
            :cart-item="item"
            @remove="remove"></cart-item>
        </div>
</div>`
});

Vue.component('cart-item', {
   props: ['cartItem', 'img'],
   template: `<div class="cart-item" >
                <div class="product-bio">
                    <img :src="img" alt="Some image">
                    <div class="product-desc">
                        <p class="product-title">{{cartItem.product_name}}</p>
                        <p class="product-quantity">Quantity: {{cartItem.quantity}}</p>
                        <p class="product-single-price">$ {{cartItem.price}} each</p>
                    </div>
                </div>
                <div class="right-block">
                    <p class="product-price">$ {{cartItem.quantity*cartItem.price}}</p>
                    <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                </div>
            </div>`
})
Vue.component('user-search', {
props:['userSearch'],
   template: `<div><form action="#" method="post" class="search-form" @click="$root.$refs.products.filter()">
            <input type="text" class="search-field" v-model="userSearch">
            <button class="btn-search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>\</div>`
})
