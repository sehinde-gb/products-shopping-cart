import Vuex from 'vuex';
import Vue from 'vue';
import shop from '@/api/shop'

Vue.use(Vuex);


export default new Vuex.Store({

    state: {
        products: [],
        // {id, quantity}
        cart: [],
        checkoutStatus: null
    },

    getters: {
        // computed properties
        availableProducts (state, getters) {
            return state.products.filter(product => product.inventory > 0)
        },

        cartProducts (state) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id)
                return {
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity
                }
            })
        },

        cartTotal (state, getters) {
            let total = 0
            getters.cartProducts.forEach(product => {
                total += product.price * product.quantity
            })
            return total
        },

        productIsInStock() {
            return (product) => {
                return product.inventory > 0
            }
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
        addProductToCart({state, getters, commit}, product) {
            if (getters.productIsInStock(product)) {
                // find cartItem
                const cartItem = state.cart.find(item => item.id === product.id)
            if (!cartItem) {
                //pushProductToCart
                commit('pushProductToCart', product.id)
            } else {
                //incrementItemQuantity
                commit('incrementItemQuantity', cartItem)
            }
            commit('decrementProductInventory', product)
            }
            
        },
        checkout ({state, commit}) {
            shop.buyProducts(
                state.cart,
                () => {
                    commit('emptyCart')
                    commit('setCheckoutStatus', 'success')
                },
                () => {
                    commit('setCheckoutStatus', 'fail')
                }
            )
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

        decrementProductInventory (state, product) {
            product.inventory--
        },
        setCheckoutStatus (state, status) {
            state.checkoutStatus = status
        },

        emptyCart(state) {
            state.cart = []
        }
    }
})