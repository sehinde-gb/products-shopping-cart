import Vuex from 'vuex';
import Vue from 'vue';
import shop from '@/api/shop'

Vue.use(Vuex);


export default new Vuex.Store({

    state: {
        products: [],
        // {id, quantity}
        cart: []
    },

    getters: {
        // computed properties
        availableProducts (state, getters) {
            return state.products.filter(product => product.inventory > 0)
        }
    },

    actions: {
        fetchProducts ({commit}) {
            
            return new Promise((resolve, reject) => {
                // make the call
                // run setProducts mutation
                shop.getProducts(products => {
                    commit('setProducts', products)
                    resolve()
                })
    
            })
            
        },
        addProductToCart(context, product) {
            if (product.inventory > 0) {
                // find cartItem
                const cartItem = context.state.cart.find(item => item.id === product.id)
            if (!cartItem) {
                //pushProductToCart
                context.commit('pushProductToCart', product.id)
            } else {
                //incrementItemQuantity
                context.commit('incrementItemQuantity', cartItem)
            }
            context.commit('decrementProductInventory', product)
            }
            
        }
    },

    mutations: {
        setProducts (state, products) {
            // update products
            state.products = products

        },

        pushProductToCart (state, productId) {
            state.cart.push({
                id: productId,
                quantity: 1
            })
        },

        incrementItemQuantity (state, cartItem) {
            cartItem.quantity++
        },

        decrementItemQuantity (state, product) {
            product.inventory--
        }
    }
})