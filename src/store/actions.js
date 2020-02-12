import shop from "@/api/shop"

export default {
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
}